//Setup a mixpanel object for testing
var null_fn = function () {};
window.mixpanel = {
  track : null_fn,
  track_links : null_fn,
  track_forms : null_fn,
  track_pageview : null_fn,
  register : null_fn,
  register_once : null_fn,
  unregister : null_fn,
  get_property : null_fn,
  identify : null_fn,
  alias : null_fn,
  get_distinct_id : null_fn,
  name_tag : null_fn,
  set_config : null_fn,
  init : null_fn,
  disable : null_fn,
  people : {
    set : null_fn,
    increment : null_fn,
    decrement : null_fn
  }
};