import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    userProfile {
      id
      gender
      height: height
      birthday
    }
  }
`;

export const EDIT_USER_PROFILE = gql`
  mutation EditUserProfile($input: EditUserProfileInput!) {
    editUserProfile(input: $input) {
      id
      gender
      height
      birthday
    }
  }
`;
