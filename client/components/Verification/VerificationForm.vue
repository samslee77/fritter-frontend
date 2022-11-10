<!-- Form for verification (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'VerificationForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/verification',
      method: 'PUT',
      hasBody: true,
      setStatus: true,
      fields: [
        {id: 'name', label: 'Name', value: ''},
        {id: 'age', label: 'Age', value: ''}
      ],
      title: 'Verify',
      callback: () => {
        this.$router.push({name: 'Verified'}); //for redirecting page
        this.$store.commit('alert', {
          message: 'You are now verified!', status: 'success'
        });
      }
    };
  }
};
</script>
