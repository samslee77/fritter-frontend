<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <img src="../../public/logo.svg">
      <h1 class="title">
        Fritter
      </h1>
    </div>
    <div class="right">
      <router-link to="/">
        🏡Home
      </router-link>
      <router-link
        v-if="$store.state.username && $store.state.verified === 'true'" 
        to="/verified"
      >
        ✔️Verification
      </router-link>
      <router-link
        v-else-if="$store.state.username && $store.state.verified === 'false'" 
        to="/verification"
      >
        ✔️Verification
      </router-link>
      <router-link 
        v-if="$store.state.username"
        to="/follow"
      >
        👉Follow
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/account"
      >
        👤Account
      </router-link>
      <router-link
        v-else
        to="/login"
      >
        Login
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: #0096FF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    box-shadow: 2px 2px 2px black;
}

.title {
    font-size: 45px;
    margin: 0 5px;
}

img {
    height: 50px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 30px;
    display: flex;
    gap: 15px;
    grid-auto-flow: column;
    align-items: center;
    color: white;
}

.right a {
    text-decoration: None;
    margin-left: 5px;
}

.alerts {
    width: 25%;
}
</style>
