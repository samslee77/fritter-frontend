<!-- Form to follow (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'FollowForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/Follow',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'username', label: 'Username', value: ''},
      ],
      title: 'Follow',
      callback: () => {
        this.$store.commit('alert', {
          message: 'You are now following this user!', status: 'success'
        });
      }
    };
  }
};
</script>
