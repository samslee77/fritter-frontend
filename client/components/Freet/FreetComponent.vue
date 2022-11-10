<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <h3 class="author">
        @{{ freet.author }}
        <div v-if="freet.author.verified === 'false'">
          ✅
        </div>
      </h3>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <hr>
    <p class="info">
      Posted on {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
    <div id="reactions">
      <button @click="like">👍 {{freet.likes}} </button>
      <button @click="dislike">👎 {{freet.dislikes}} </button>
    </div>
    <div
      v-if="$store.state.username === freet.author"
      class="actions"
    >
      <button @click="deleteFreet">
        🗑️ Delete
      </button>
      <button
        v-if="freet.ageRestrictedViewing === 'false'"
        @click="ageRestrict"
      >
        🔞 Age-Restrict
      </button>
      <div
        v-if="freet.ageRestrictedViewing === 'true'"
      >
        🔞 Age-Restricted
      </div>
      
    </div>
  </article>
</template>

<script>
export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
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
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async ageRestrict() {
      const options = {
        method: 'PUT', headers: {'Content-Type': 'application/json'}
      };
      
      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshFreets');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async like() {
      const options = {
        method: 'POST', headers: {'Content-Type': 'application/json'}
      };
      options.body = JSON.stringify({'id': this.freet._id}); 
      await fetch(`/api/reactions/like`, options)
        .then(async (response) => {
          if (!response.ok) {
            if (this.$store.username !== null) {
              const options = {
                method: 'DELETE', headers: {'Content-Type': 'application/json'}
              };
              options.body = JSON.stringify({'id': this.freet._id});
              await fetch(`/api/reactions/like`, options);
            }
          }
      });
      this.$store.commit('refreshFreets');
    },
    async dislike() {
        const options = {
          method: 'POST', headers: {'Content-Type': 'application/json'}
        };
        options.body = JSON.stringify({'id': this.freet._id});
        await fetch(`/api/reactions/dislike`, options)
          .then(async (response) => {
          if (!response.ok) {
            if (this.$store.username !== null) {
              const options = {
                method: 'DELETE', headers: {'Content-Type': 'application/json'}
              };
              options.body = JSON.stringify({'id': this.freet._id});
              await fetch(`/api/reactions/dislike`, options);
            }
          }
        this.$store.commit('refreshFreets');
      });
    }
  }
};
</script>

<style scoped>
.freet {
    border: 5px solid #111;
    padding: 15px;
    position: relative;
    font-size: 25px;
    border-radius: 25px;
    box-shadow: 3px 3px 3px gray;
    margin-bottom: 50px;
    background-color: #87cefa;
}

.reactions {
  position: center;
}


.content {
  border: 0.5px solid #111;
  padding: 30px;
  border-radius: 10px;
  background-color: white;
}

h3 {
  padding: 10px 20px;
  text-align: center;
  display: inline-block;
  font-size: 25px;
  background-color: #E6E6FA;
  border-radius: 30px;
}

button {
  padding: 7px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 22px;
  background-color: #C8C8C8;
  border-radius: 10px;
  box-shadow: 2px 2px 2px black;
}
</style>
