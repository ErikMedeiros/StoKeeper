const BASE_URL = "http://localhost:5000";

async function isAdmin() {
    const id = window.localStorage.getItem("token");
    if (!id) return false; 
      
    try {
        const response = await fetch(`${BASE_URL}/employee/admin/${id}`);
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

function redirectTo(href) {
    window.location.href = href;
}

/** @param {string} date  */
function formatDate(text) {
    const date = new Date(text);
    
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hour = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const timezone = (date.getTimezoneOffset() / 60).toString().padStart(2, '0').padEnd(4, '0');
    return `${year}-${month}-${day}T${hour}:${minutes}:00-${timezone}`;
  }