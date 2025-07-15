<template>
  <div class="bar-spinner">
    <div class="bar bar-1"></div>
    <div class="bar bar-2"></div>
    <div class="bar bar-3"></div>
    <div class="bar bar-4"></div>
    <div class="bar bar-5"></div>
  </div>
</template>

<style scoped>
.bar-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
}

.bar {
  width: 10px;
  height: 40px;
  margin: 0 2px;
  background-color: currentColor;
  animation: bar-bounce 1.2s infinite ease-in-out;
}

.bar-1 {
  animation-delay: -0.32s;
}

.bar-2 {
  animation-delay: -0.24s;
}

.bar-3 {
  animation-delay: -0.16s;
}

.bar-4 {
  animation-delay: -0.08s;
}

.bar-5 {
  animation-delay: 0s;
}

@keyframes bar-bounce {

  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }

  20% {
    transform: scaleY(1);
  }
}
</style>
