<script setup lang="ts">
  import { NConfigProvider } from 'naive-ui';
  import { uiLocale, uiDateLocale } from '@/i18n';
</script>

<template>
  <NConfigProvider :locale="uiLocale" :date-locale="uiDateLocale">
  </NConfigProvider>
</template>

