const URL = "http://localhost:5000";

async function isAdmin() {
    const id = window.localStorage.getItem("token");
    if (!id) return false; 
      
    try {
        const response = await fetch(`${URL}/employee/admin/${id}`);
        if (!response.ok) return false;
        
        const { isAdmin } = await response.json()
        return isAdmin;
    } catch(_) {
        return false;
    }
}

function logout(href) {
    window.localStorage.removeItem("token")
    window.location.href = href
}