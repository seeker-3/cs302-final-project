// mod utils;

use wasm_bindgen::prelude::*;

// #[cfg(feature = "wee_alloc")]
// #[global_allocator]
// static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// #[wasm_bindgen]
// extern {
//     fn alert(s: &str);
// }

// #[wasm_bindgen]
// pub fn greet() {
//     alert("Hello, wasm!");
// }

#[wasm_bindgen]
pub struct Counter {
    count: u8,
}

#[wasm_bindgen]
impl Counter {
    pub fn new() -> Self {
        Counter { count: 0 }
    }
    pub fn increment(&mut self) -> u8 {
        self.count += 1;
        self.count
    }
}
