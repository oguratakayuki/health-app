<template>
  <div class="layout-container">
    <header class="header">
      <h1>サイト名</h1>
      <nav>
        <ul>
          <li><NuxtLink to="/">ホーム</NuxtLink></li>
          <li><NuxtLink to="/about">About</NuxtLink></li>
        </ul>
      </nav>
    </header>

    <div class="main-content">
      <aside class="sidebar">
        <ul>
          <li><NuxtLink to="/">ダッシュボード</NuxtLink></li>
          <li><NuxtLink to="/settings">設定</NuxtLink></li>
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
  background-color: #007bff;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 200px;
  background-color: #f4f4f4;
  padding: 10px;
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

