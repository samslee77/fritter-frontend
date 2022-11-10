<!-- Form to follow (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'UnfollowForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/Follow',
      method: 'DELETE',
      hasBody: true,
      fields: [
        {id: 'username', label: 'Username', value: ''},
      ],
      title: 'Unfollow',
      callback: () => {
        this.$store.commit('alert', {
          message: 'You have unfollowed the user!', status: 'success'
        });
      }
    };
  }
};
</script>
