import { useCallback, useEffect, useRef, useState } from 'react';
import { Settings } from '../constants/config';
import {
  applyRun,
  clearProfile,
  defaultProfile,
  loadProfile,
  Profile,
  RunResult,
  saveProfile,
} from '../game/storage';

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [ready, setReady] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    loadProfile()
      .then(loaded => {
        if (mounted.current) {
          setProfile(loaded);
          setReady(true);
        }
      })
      .catch(() => {
        if (mounted.current) {
          setReady(true);
        }
      });
    return () => {
      mounted.current = false;
    };
  }, []);

  const persist = useCallback((next: Profile) => {
    setProfile(next);
    saveProfile(next);
    return next;
  }, []);

  const recordRun = useCallback(
    (run: RunResult) => {
      let merged: Profile = defaultProfile();
      setProfile(prev => {
        merged = applyRun(prev, run);
        saveProfile(merged);
        return merged;
      });
      return merged;
    },
    [],
  );

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      setProfile(prev => {
        const next = { ...prev, settings: { ...prev.settings, ...patch } };
        saveProfile(next);
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    clearProfile().then(fresh => setProfile(fresh));
  }, []);

  return { profile, ready, persist, recordRun, updateSettings, reset };
}

export default useProfile;
