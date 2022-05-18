<template>
    <h1>{{ sectionInfo.name }}</h1>
    <div v-for="cred in sectionInfo.creds">
        {{ cred[0] }}{{ cred[1] }}
    </div>
</template>

<script>
export default {
    props: ['sectionInfo'],
};
</script>


