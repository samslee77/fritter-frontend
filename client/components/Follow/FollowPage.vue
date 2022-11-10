<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Please enter the username of the user you wish to follow!</h2>
      </header>
      <FollowForm />
      <header>
        <h2>Please enter the username of the user you wish to unfollow!</h2>
      </header>
      <UnfollowForm />
    </section>
    <section>
      <header>
        <h3>Here are the users you are following!</h3>
      </header>
      <div v-if="!$store.state.followers.length">
        You aren't following any users
      </div>
      <p
        v-for="user in $store.state.following"
        :key="user.username"
      >
        {{username}}
      </p>
    </section>
  </main>
</template>

<script>
import FollowForm from '@/components/Follow/FollowForm.vue';
import UnfollowForm from '@/components/Follow/UnfollowForm.vue';
export default {
  name: 'FollowPage',
  components: {
    FollowForm,
    UnfollowForm
  },
  async mounted() {
    try {
      const ret = await fetch(`/api/Follow/following`);
      const following = await ret.json();
      if (!ret.ok) {
          throw new Error(following.error);
      }
      this.$store.commit('updateFollowing', following);
    } catch (e) {
      this.$set(this.alerts, e, 'error');
      setTimeout(() => this.$delete(this.alerts, e), 3000);
    }
  }
};
</script>
