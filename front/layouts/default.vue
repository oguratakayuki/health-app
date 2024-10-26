<template>
  <div class="layout-container">
    <header class="header">
      <h1>食品情報管理画面</h1>
    </header>

    <div class="main-content">
      <aside class="sidebar">
        <ul class="sidebar-list">
          <li><NuxtLink to="/" class="sidebar-link">ダッシュボード</NuxtLink></li>
          <li><NuxtLink to="/settings" class="sidebar-link">設定</NuxtLink></li>
        </ul>
      </aside>

      <main class="page-content">
        <slot /> <!-- ページのコンテンツがここに挿入される -->
      </main>
    </div>

    <footer class="footer">
      <p>Copyright © 2024</p>
    </footer>
  </div>
</template>


<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  padding: 10px 10px 10px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  margin: 20px;
}

.main-content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 200px;
  padding: 10px;
  margin: 10px;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* サイドバーのリンクをボタン風に */
.sidebar-link {
  color: #333;
  background-color: transparent;
  border: none;
  border-right: 2px solid black;
  border-bottom: 2px solid black;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none; /* リンクの下線を削除 */
  display: block; /* 横幅を統一するために block に */
  width: 100%; /* ボタンの横幅を100%に */
  box-sizing: border-box; /* パディングを含めて幅を調整 */
}

/* ボタン間の縦方向の間隔を広げる */
.sidebar-list li {
  margin-bottom: 15px; /* 要素間のスペースを追加 */
}

.sidebar-link:hover {
  transform: scale(0.95); /* ホバー時に縮む効果 */
}

.page-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 10px;
}
</style>


