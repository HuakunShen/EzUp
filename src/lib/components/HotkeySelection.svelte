<script lang="ts">
  import { cloneDeep } from 'lodash';
  import { onDestroy, onMount } from 'svelte';
  import { isShortcut } from '$lib/util';

  export let key: string;
  export let activeKey: string;

  export function start() {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  }

  export function end() {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  }

  export let keyCombination = '';
  let curKeyCombinationArr: string[] = [];
  let keyCombMemo: string[] = [];
  const keyDownMap = new Map();

  const updatePressedKeys = () => {
    curKeyCombinationArr = [];
    keyDownMap.forEach((value, key, map) => {
      if (value) curKeyCombinationArr.push(key);
    });
    if (isShortcut(curKeyCombinationArr)) {
      keyCombMemo = cloneDeep(curKeyCombinationArr);
    }
  };

  function onKeyDown(e: KeyboardEvent) {
    keyDownMap.set(e.key, true);
    updatePressedKeys();
  }
  function onKeyUp(e: KeyboardEvent) {
    keyDownMap.delete(e.key);
    updatePressedKeys();
  }

  onDestroy(() => {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  });

  $: keyCombination = keyCombMemo.join('+');
  $: if (key === activeKey) {
    start();
  } else {
    end();
  }
</script>
