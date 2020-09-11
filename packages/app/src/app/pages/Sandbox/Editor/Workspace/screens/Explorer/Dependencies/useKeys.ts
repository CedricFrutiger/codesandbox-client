import { useEffect } from 'react';
import useKeys from 'react-use/lib/useKeyboardJs';
import { useOvermind } from 'app/overmind';
import { Dependency } from '@codesandbox/common/lib/types/algolia';

export const useKeyboard = (
  list: { current: HTMLElement },
  searchInput: { current: HTMLFormElement }
) => {
  const {
    actions: {
      modalOpened,
      editor: { addNpmDependency },
    },
    state: {
      workspace: { explorerDependencies },
    },
  } = useOvermind();
  const [one] = useKeys('ctrl + one');
  const [two] = useKeys('ctrl + two');
  const [three] = useKeys('ctrl + three');
  const [four] = useKeys('ctrl + four');
  const [all] = useKeys('ctrl + d');
  const [enter] = useKeys('enter');

  const addDependency = (dependency: Dependency) => {
    addNpmDependency({
      name: dependency.name,
      version: dependency.tags.latest,
    });
  };

  useEffect(() => {
    const activeElement = document.activeElement;
    const input = searchInput.current;

    if (enter && activeElement === input) {
      if (input.value.includes('@')) {
        const isScoped = input.value.startsWith('@');
        let version = 'latest';

        const dependencyAndVersion = input.value.split('@');

        if (dependencyAndVersion.length > (isScoped ? 2 : 1)) {
          version = dependencyAndVersion.pop();
        }

        addNpmDependency({
          name: dependencyAndVersion.join('@'),
          version,
        });
      }

      if (list && list.current && explorerDependencies.length) {
        addDependency(explorerDependencies[0]);
      }
    }

    if (list && list.current && explorerDependencies.length) {
      if (one) {
        addDependency(explorerDependencies[0]);
      }
      if (two && explorerDependencies[1]) {
        addDependency(explorerDependencies[1]);
      }
      if (three && explorerDependencies[2]) {
        addDependency(explorerDependencies[2]);
      }
      if (four && explorerDependencies[3]) {
        addDependency(explorerDependencies[3]);
      }
      if (all) {
        modalOpened({ modal: 'searchDependencies' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [one, two, three, four, all, list, enter]);
};
