use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Counter {
  count: u8,
}

#[wasm_bindgen]
impl Counter {
  pub fn new() -> Self {
    Counter { count: 0 }
  }
  pub fn increment(&mut self) {
    self.count += 1;
  }
  pub fn get_count(&self) -> u8 {
    return self.count;
  }
}
