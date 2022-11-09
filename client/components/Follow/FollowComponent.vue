<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="follow"
  >
    <header>
      <h3 class="author">
        @{{ follow.following }}
      </h3>
      <div
        class="actions"
      >
        <button
          @click="deleteFollow"
        >
          ❌ Unfollow
        </button>
      </div>
    </header>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'FollowComponent',
  props: {
    // Data from the stored freet
    follow: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    deleteFollow() {
      /**
       * remove follow.
       */
      const params = {
        method: 'DELETE',
        body: JSON.stringify({content: this.follow.following}),
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully unfollowed user!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the follow's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/Follow`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
