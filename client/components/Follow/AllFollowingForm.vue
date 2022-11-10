<!-- Form to follow (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'AllFollowingForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/Follow/following',
      method: 'GET',
      title: 'Click to See Who You Are Following!',
      callback: () => {
        this.$store.commit('alert', {
          message: 'Here are the users you are Following!', status: 'success'
        });
      }
    };
  }
};
</script>
