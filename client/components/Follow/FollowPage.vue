<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Please enter the username of the user you wish to follow!</h2>
      </header>
      <FollowForm />
    </section>
    <section>
      <header>
        <h3>Here are the users you are following!</h3>
      </header>
      <FollowComponent
        v-for="following in $store.state.following"
        :key="following.username"
      />
    </section>
  </main>
</template>

<script>
import FollowForm from '@/components/Follow/FollowForm.vue';
//import FollowingForm from '@/components/Following/FollowingForm.vue';
import FollowComponent from '@/components/Follow/FollowComponent.vue';
export default {
  name: 'FollowPage',
  components: {
    FollowForm,
    FollowComponent
  },
  
};
</script>
