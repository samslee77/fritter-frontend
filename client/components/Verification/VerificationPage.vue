<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Verify Yourself Here!</h2>
      </header>
      <VerificationForm />
    </section>
  </main>
</template>

<script>
import VerificationForm from '@/components/Verification/VerificationForm.vue';

export default {
  name: 'VerificationPage',
  components: {
    VerificationForm
  }
};
</script>
