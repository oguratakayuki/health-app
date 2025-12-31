import { CognitoService } from '../CognitoService';
import { UserService } from '../UserService';

// 自動モックを使用
jest.mock('amazon-cognito-identity-js');
jest.mock('jwt-decode');
jest.mock('../UserService');
jest.mock('@/config/cognito');

describe('CognitoService', () => {
  let cognitoService: CognitoService;
  let mockUserService: jest.Mocked<UserService>;
  // テスト用の設定
  const mockConfig = {
    userPoolId: 'test-user-pool-id',
    clientId: 'test-client-id',
    endpoint: 'http://localhost:9229'
  };

  // モックのCognitoレスポンス
  const mockCognitoResponse = {
    AuthenticationResult: {
      IdToken: 'mock-id-token',
      AccessToken: 'mock-access-token',
      RefreshToken: 'mock-refresh-token'
    }
  };

  // デコードされたトークン
  const mockDecodedToken = {
    sub: 'test-cognito-sub',
    email: 'test@example.com',
    name: 'Test User'
  };

  beforeEach(() => {
    // モックのリセット
    jest.clearAllMocks();
    // 設定のモック
    const { getCognitoConfig } = require('@/config/cognito');
    getCognitoConfig.mockReturnValue(mockConfig);
    // UserServiceのモック
    const MockUserService = require('../UserService').UserService;
    mockUserService = new MockUserService();
    mockUserService.updateCognitoSub = jest.fn().mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      cognitoSub: 'test-cognito-sub',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    // CognitoServiceのインスタンス作成
    cognitoService = new CognitoService(mockUserService);
    // グローバルfetchのモック
    global.fetch = jest.fn();
    // jwt-decodeのモック
    const { jwtDecode } = require('jwt-decode');
    jwtDecode.mockReturnValue(mockDecodedToken);
    // fetchのデフォルトモックレスポンス
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockCognitoResponse
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with config', () => {
      expect(cognitoService).toBeInstanceOf(CognitoService);
      const { getCognitoConfig } = require('@/config/cognito');
      expect(getCognitoConfig).toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should sign in successfully', async () => {
      // 実行
      const result = await cognitoService.signIn('test@example.com', 'password123');

      // 検証
      expect(result).toEqual({
        idToken: 'mock-id-token',
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      });

      // fetchが正しい引数で呼ばれたか
      expect(global.fetch).toHaveBeenCalledWith('http://cognito-local:9229/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-amz-json-1.1',
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth'
        },
        body: JSON.stringify({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: 'aoziznd202gllzsx7b1q4ksgr',
          AuthParameters: {
            USERNAME: 'test@example.com',
            PASSWORD: 'password123'
          }
        })
      });

      // jwtDecodeが呼ばれたか
      const { jwtDecode } = require('jwt-decode');
      expect(jwtDecode).toHaveBeenCalledWith('mock-id-token');

      // UserService.updateCognitoSubが呼ばれたか
      expect(mockUserService.updateCognitoSub).toHaveBeenCalledWith(
        'test@example.com',
        'test-cognito-sub'
      );
    });

    it('should throw error when username or password is missing', async () => {
      // 実行 & 検証
      await expect(cognitoService.signIn('', 'password123'))
        .rejects.toThrow('Missing username or password');
      await expect(cognitoService.signIn('test@example.com', ''))
        .rejects.toThrow('Missing username or password');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle authentication failure', async () => {
      // 失敗レスポンスのモック
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' })
      });

      // 実行 & 検証
      await expect(cognitoService.signIn('test@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should handle missing AuthenticationResult', async () => {
      // 不完全なレスポンスのモック
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}) // AuthenticationResultがない
      });

      // 実行 & 検証
      await expect(cognitoService.signIn('test@example.com', 'password123'))
        .rejects.toThrow('Login failed');
    });

    it('should handle token decoding error gracefully', async () => {
      // jwtDecodeがエラーを投げる
      const { jwtDecode } = require('jwt-decode');
      jwtDecode.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // 実行
      const result = await cognitoService.signIn('test@example.com', 'password123');

      // 検証 - エラーがキャッチされて処理が続行される
      expect(result).toEqual({
        idToken: 'mock-id-token',
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      });
      // UserService.updateCognitoSubは呼ばれない
      expect(mockUserService.updateCognitoSub).not.toHaveBeenCalled();
    });

    it('should handle UserService update error gracefully', async () => {
      // UserServiceがエラーを投げる
      mockUserService.updateCognitoSub.mockRejectedValue(new Error('DB error'));

      // 実行
      const result = await cognitoService.signIn('test@example.com', 'password123');

      // 検証 - エラーがキャッチされて処理が続行される
      expect(result).toEqual({
        idToken: 'mock-id-token',
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      });
    });
  });

  describe('signUp', () => {
    it.skip('should sign up successfully', async () => {
      // amazon-cognito-identity-jsのモック設定
      const { CognitoUserPool } = require('amazon-cognito-identity-js');
      const mockSignUp = jest.fn().mockImplementation((email, password, attributes, callback) => {
        callback(null, {
          user: { getUsername: () => email },
          userConfirmed: false,
          codeDeliveryDetails: {
            Destination: email,
            DeliveryMedium: 'EMAIL',
            AttributeName: 'email'
          }
        });
      });
      // モックを上書き
      CognitoUserPool.mockImplementation(() => ({
        signUp: mockSignUp
      }));

      // 実行
      const result = await cognitoService.signUp('test@example.com', 'password123', 'Test User');

      // 検証
      expect(result.user.getUsername()).toBe('test@example.com');
      expect(result.userConfirmed).toBe(false);
    });

    it.skip('should throw error when sign up fails', async () => {
      // amazon-cognito-identity-jsのモック設定
      const { CognitoUserPool } = require('amazon-cognito-identity-js');
      const mockSignUp = jest.fn().mockImplementation((email, password, attributes, callback) => {
        callback(new Error('User already exists'), null);
      });
      // モックを上書き
      CognitoUserPool.mockImplementation(() => ({
        signUp: mockSignUp
      }));

      // 実行 & 検証
      await expect(cognitoService.signUp('test@example.com', 'password123', 'Test User'))
        .rejects.toThrow('User already exists');
    });
  });

  describe('confirmSignUp', () => {
    it('should confirm sign up successfully', async () => {
      // amazon-cognito-identity-jsのモック設定
      const { CognitoUser } = require('amazon-cognito-identity-js');
      const mockConfirmRegistration = jest.fn().mockImplementation((code, forceAliasCreation, callback) => {
        callback(null, 'SUCCESS');
      });
      // モックを上書き
      CognitoUser.mockImplementation(() => ({
        confirmRegistration: mockConfirmRegistration
      }));

      // 実行
      await expect(cognitoService.confirmSignUp('test@example.com', '123456'))
        .resolves.not.toThrow();
    });

    it('should throw error when confirmation fails', async () => {
      // amazon-cognito-identity-jsのモック設定
      const { CognitoUser } = require('amazon-cognito-identity-js');
      const mockConfirmRegistration = jest.fn().mockImplementation((code, forceAliasCreation, callback) => {
        callback(new Error('Invalid code'), null);
      });
      // モックを上書き
      CognitoUser.mockImplementation(() => ({
        confirmRegistration: mockConfirmRegistration
      }));

      // 実行 & 検証
      await expect(cognitoService.confirmSignUp('test@example.com', 'wrong-code'))
        .rejects.toThrow('Invalid code');
    });
  });

  describe('initialize', () => {
    it('should resolve without error', async () => {
      // 実行
      await expect(cognitoService.initialize()).resolves.not.toThrow();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when not implemented', async () => {
      // 実行
      const result = await cognitoService.getCurrentUser();
      // 検証
      expect(result).toBeNull();
    });
  });
});
