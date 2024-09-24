use ic_cdk::export::Principal;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::time::{SystemTime, UNIX_EPOCH};


#[derive(Serialize, Deserialize, Clone)]
struct User {
    id: Principal,
    name: String,
    email: String,
    registration_date: u64,
}

thread_local! {
    static USERS: RefCell<Vec<User>> = RefCell::new(Vec::new());
    static VISIT_COUNT: RefCell<u64> = RefCell::new(0);
}

fn current_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs()
}

#[update]
fn register_user(name: String, email: String) -> String {
    let caller = ic_cdk::caller();
    let timestamp = current_timestamp();

    let new_user = User {
        id: caller,
        name: name.clone(),
        email,
        registration_date: timestamp,
    };

    USERS.with(|users| {
        let mut users_mut = users.borrow_mut();
        if users_mut.iter().any(|user| user.id == caller) {
            return format!("User {} is already registered.", name);
        }
        users_mut.push(new_user);
    });

    format!("User {} registered successfully!", name)
}

#[query]
fn get_user_profile(id: Principal) -> Option<User> {
    USERS.with(|users| {
        let users_ref = users.borrow();
        users_ref.iter().find(|user| user.id == id).cloned()
    })
}

#[update]
fn increment_visit_count() -> u64 {
    VISIT_COUNT.with(|count| {
        let mut count_mut = count.borrow_mut();
        *count_mut += 1;
        *count_mut
    })
}

#[query]
fn get_visit_count() -> u64 {
    VISIT_COUNT.with(|count| *count.borrow())
}

#[query]
fn get_all_users() -> Vec<User> {
    USERS.with(|users| users.borrow().clone())
}