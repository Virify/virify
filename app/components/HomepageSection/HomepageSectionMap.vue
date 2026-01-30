<template>
  <div class="homepage-section-map">

    <img src="/img/demo/map-shadow.svg" class="homepage-section-map__shadow" />

    <div class="homepage-section-map__map">
      <img src="/img/demo/map.svg" alt="Floating map tile" class="homepage-section-map__map-tile" />
    </div>
  </div>
</template>

<style lang="scss">
.homepage-section-map {
  width: min(100%, 40ch);
  position: relative;
  margin: 0 auto;
  height: min(100vh, 60ch);
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  padding: var(--size-72) 0;
  box-sizing: border-box;

  &__map {
    position: relative;
    animation-name: levitateMap;
    z-index: 2;
  }

  &__map-tile {
    display: block;
    width: 100%;
  }

  &__shadow {
    position: absolute;
    bottom: var(--size-20);
    left: 0;
    width: 100%;
    animation-name: fadeMapShadow;
    opacity: 0.7;
    filter: blur(20px);
    transform: scale(0.9);
  }

  &__map,
  &__shadow {
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
  }
}

@keyframes levitateMap {
  from {
    transform: translateY(var(--size-16))
  }
}

@keyframes fadeMapShadow {
  from {
    opacity: 1;
    filter: blur(10px);
    transform: scale(0.95);
  }
}
</style>