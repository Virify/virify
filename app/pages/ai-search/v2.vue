<template>
  <div class="| container container-sm flow flow-lg">
    <h1 class="| title-xl font-bold">
      Find your perfect home with
      <span class="| gradient-text gradient-text-ai">AI</span>
      enhanced property search
    </h1>

    <hr class="| divider" style="margin: 2em 0">

    <div class="filters-group">
      <h2 class="| title-xs">Location</h2>

      <ul>
        <li>
          <AtomsButtonPill content="Glasgow" icon="cross" icon-start />
        </li>
        <li>
          <AtomsButtonPill variant="solid" content="Edit" icon="ai/edit" icon-start />
        </li>
        <li>
          <AtomsButtonPill variant="ghost" content="Automation" icon="ai/prompt" icon-start />
        </li>
      </ul>
    </div>

    <MoleculesPromptbox :id="textareaId" placeholder="Describe your ideal property here..." v-model="promptTextarea" />

    <ul>
      <li v-for="prompt of examplePrompts">
        <AtomsButtonPill variant="ghost" :content="prompt" icon="ai/prompt" icon-start
          @click.prevent="addPrompt(prompt)" />
      </li>
    </ul>
  </div>
</template>

<script setup>
const textareaId = useId()

const promptTextarea = ref('')

const examplePrompts = [
  '4 bedroom house with a garden',
  'Studio flat with a balcony',
  '2+ bedroom property',
  '3 bedroom detached cottage with a downstairs bathroom',
  'A large parcel of land',
  '3 bedroom house with a garden and a detached garage'
]

function addPrompt(prompt) {
  promptTextarea.value = prompt

  document?.getElementById(textareaId)?.focus()
}
</script>

<style lang="scss" scoped>
@use '#styles/_utils/functions' as fn;

h2 {
  max-width: 42ch;
}

ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: var(--size-10) 0;
  gap: var(--size-8);
}
</style>