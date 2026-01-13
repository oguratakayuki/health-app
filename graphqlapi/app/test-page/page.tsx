export default function TestPage() {
  return (
    <div className="p-8">
      {/* Tailwind CSS テスト */}
      <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded">
        Tailwind CSSが動作していれば青いボックスが表示されます
      </div>
      {/* Autoprefixer テスト */}
      <div className="test-autoprefixer mb-4 p-4 bg-green-100 text-green-800 rounded">
        Autoprefixerテスト（flexbox）
      </div>
      {/* Grid テスト */}
      <div className="test-grid mb-4">
        <div className="p-4 bg-red-100">Gridアイテム1</div>
        <div className="p-4 bg-red-200">Gridアイテム2</div>
        <div className="p-4 bg-red-300">Gridアイテム3</div>
      </div>
      {/* 直接Tailwindクラステスト */}
      <div className="mt-4 p-4 border-2 border-purple-500 rounded-lg">
        <h2 className="text-xl font-bold text-purple-700 mb-2">
          直接スタイルテスト
        </h2>
        <p className="text-gray-600">
          Tailwindクラスが適用されていれば、様々なスタイルが表示されます
        </p>
        <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          ホバーエフェクトテスト
        </button>
      </div>
    </div>
  );
}
