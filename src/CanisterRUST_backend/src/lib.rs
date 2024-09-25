use candid::{CandidType};
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use ic_cdk::api::time;

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct User {
    name: String,
    email: String,
    registration_date: String,
}

thread_local! {
    static USERS: RefCell<Vec<User>> = RefCell::new(Vec::new());
}

fn current_timestamp() -> String  {
    (time() / 1000).to_string()
}

#[update]
fn register_user(name: String, email: String) -> String {
    let timestamp = current_timestamp();

    let new_user = User {
        name: name.clone(),
        email: email.clone(),
        registration_date: timestamp,
    };

    let result = USERS.with(|users| {
        let mut users_mut = users.borrow_mut();
        
        if users_mut.iter().any(|user| user.email == email) {
            return format!("Email {} is already registered.", email);
        }
        users_mut.push(new_user);
        format!("User {} registered successfully with email {}!", name, email)
    });

    result
}

#[query]
fn get_user_profile(email: String) -> Option<User> {
    USERS.with(|users| {
        let users_ref = users.borrow();
        users_ref.iter().find(|user| user.email == email).cloned()
    })
}

#[query]
fn get_all_users() -> Vec<User> {
    USERS.with(|users| users.borrow().clone())
} 

ic_cdk::export_candid!();