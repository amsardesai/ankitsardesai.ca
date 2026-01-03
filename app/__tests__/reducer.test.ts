import type { Actions, State } from '../reducer.js';
import reducer, { getInitialState } from '../reducer.js';

describe('reducer', () => {
  describe('initial state', () => {
    it('returns correct initial state when called with undefined', () => {
      const result = reducer(undefined, { type: 'SHOW_PHOTO' });

      expect(result).toEqual({
        currentPhoto: undefined,
        previousPhoto: undefined,
        transitioning: false, // SHOW_PHOTO sets this to false
      });
    });

    it('has transitioning: true in the default initial state', () => {
      // Create a state with PUSH_NEXT_PHOTO to verify initial transitioning behavior
      const state = reducer(undefined, {
        type: 'PUSH_NEXT_PHOTO',
        name: 'test',
        location: 'Test Location',
      });

      expect(state.transitioning).toBe(true);
    });
  });

  describe('SHOW_PHOTO action', () => {
    it('sets transitioning to false', () => {
      const prevState: State = {
        currentPhoto: { name: 'photo1', location: 'Location 1' },
        previousPhoto: undefined,
        transitioning: true,
      };

      const result = reducer(prevState, { type: 'SHOW_PHOTO' });

      expect(result.transitioning).toBe(false);
    });

    it('preserves currentPhoto and previousPhoto', () => {
      const prevState: State = {
        currentPhoto: { name: 'photo1', location: 'Location 1' },
        previousPhoto: { name: 'photo0', location: 'Location 0' },
        transitioning: true,
      };

      const result = reducer(prevState, { type: 'SHOW_PHOTO' });

      expect(result.currentPhoto).toEqual(prevState.currentPhoto);
      expect(result.previousPhoto).toEqual(prevState.previousPhoto);
    });
  });

  describe('PUSH_NEXT_PHOTO action', () => {
    it('shifts currentPhoto to previousPhoto', () => {
      const prevState: State = {
        currentPhoto: { name: 'photo1', location: 'Location 1' },
        previousPhoto: undefined,
        transitioning: false,
      };

      const result = reducer(prevState, {
        type: 'PUSH_NEXT_PHOTO',
        name: 'photo2',
        location: 'Location 2',
      });

      expect(result.previousPhoto).toEqual({
        name: 'photo1',
        location: 'Location 1',
      });
    });

    it('sets new currentPhoto from action payload', () => {
      const prevState: State = {
        currentPhoto: { name: 'photo1', location: 'Location 1' },
        previousPhoto: undefined,
        transitioning: false,
      };

      const result = reducer(prevState, {
        type: 'PUSH_NEXT_PHOTO',
        name: 'photo2',
        location: 'Location 2',
      });

      expect(result.currentPhoto).toEqual({
        name: 'photo2',
        location: 'Location 2',
      });
    });

    it('sets transitioning to true', () => {
      const prevState: State = {
        currentPhoto: { name: 'photo1', location: 'Location 1' },
        previousPhoto: undefined,
        transitioning: false,
      };

      const result = reducer(prevState, {
        type: 'PUSH_NEXT_PHOTO',
        name: 'photo2',
        location: 'Location 2',
      });

      expect(result.transitioning).toBe(true);
    });

    it('works when previousPhoto already exists', () => {
      const prevState: State = {
        currentPhoto: { name: 'photo2', location: 'Location 2' },
        previousPhoto: { name: 'photo1', location: 'Location 1' },
        transitioning: false,
      };

      const result = reducer(prevState, {
        type: 'PUSH_NEXT_PHOTO',
        name: 'photo3',
        location: 'Location 3',
      });

      expect(result.previousPhoto).toEqual({
        name: 'photo2',
        location: 'Location 2',
      });
      expect(result.currentPhoto).toEqual({
        name: 'photo3',
        location: 'Location 3',
      });
    });
  });

  describe('unknown action', () => {
    it('returns state unchanged for unknown action type', () => {
      const prevState: State = {
        currentPhoto: { name: 'photo1', location: 'Location 1' },
        previousPhoto: undefined,
        transitioning: false,
      };

      // Type assertion to test unknown action handling
      const result = reducer(prevState, { type: 'UNKNOWN' } as unknown as Actions);

      expect(result).toBe(prevState); // Same reference, not just equal
    });
  });
});

describe('getInitialState', () => {
  it('creates state with currentPhoto from arguments', () => {
    const result = getInitialState('test-photo', 'Test Location');

    expect(result.currentPhoto).toEqual({
      name: 'test-photo',
      location: 'Test Location',
    });
  });

  it('sets previousPhoto to undefined', () => {
    const result = getInitialState('test-photo', 'Test Location');

    expect(result.previousPhoto).toBeUndefined();
  });

  it('sets transitioning to true', () => {
    const result = getInitialState('test-photo', 'Test Location');

    expect(result.transitioning).toBe(true);
  });
});
