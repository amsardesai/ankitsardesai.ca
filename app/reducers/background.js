
export default function backgroundReducer(prevState, action) {
  switch (action.type) {
    case 'GET_NEW_PHOTO': return {
      ...prevState,
      prev: prevState.current,
      current: prevState.next,
      next: action.payload,
    };
    case 'CHANGE_SCROLL_TOP': return {
      ...prevState,
      scrollTop: action.payload,
    };
    default: return {
      ...prevState,
    };
  }
}
