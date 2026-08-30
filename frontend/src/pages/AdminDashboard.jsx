import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function AdminDashboard() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [status, setStatus] = useState("");
    const [adminResponse, setAdminResponse] = useState("");

    const token = localStorage.getItem("token");

    const getComplaints = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API_URL}/api/complaints`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setComplaints(response.data.complaints || []);
            setError("");
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to load complaints."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getComplaints();
    }, []);

    const startEdit = (complaint) => {
        setEditingId(complaint._id);
        setStatus(complaint.status);
        setAdminResponse(complaint.adminResponse || "");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setStatus("");
        setAdminResponse("");
    };

    const updateComplaint = async (id) => {
        try {
            await axios.put(
                `${API_URL}/api/complaints/${id}`,
                {
                    status,
                    adminResponse
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            alert("Complaint updated successfully.");

            cancelEdit();
            getComplaints();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                "Failed to update complaint."
            );
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const pendingCount = complaints.filter(
        (complaint) => complaint.status === "pending"
    ).length;

    return (
        <div style={styles.page}>

            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>
                        Hostel Management System
                    </h1>

                    <p style={styles.subtitle}>
                        Admin Dashboard
                    </p>
                </div>

                <button
                    onClick={logout}
                    style={styles.logoutButton}
                >
                    Logout
                </button>
            </header>

            <main style={styles.main}>

                <h2 style={styles.welcome}>
                    Welcome, Hostel Admin 👋
                </h2>

                <div style={styles.cards}>

                    <div style={styles.card}>
                        <div style={styles.cardTitle}>
                            🛏️ Rooms
                        </div>
                        <div style={styles.cardNumber}>
                            1
                        </div>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.cardTitle}>
                            💰 Fees
                        </div>
                        <div style={styles.cardNumber}>
                            1
                        </div>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.cardTitle}>
                            📝 Complaints
                        </div>
                        <div style={styles.cardNumber}>
                            {complaints.length}
                        </div>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.cardTitle}>
                            ⏳ Pending Complaints
                        </div>
                        <div style={styles.cardNumber}>
                            {pendingCount}
                        </div>
                    </div>

                </div>

                <section style={styles.section}>

                    <h2 style={styles.sectionTitle}>
                        Complaint Management
                    </h2>

                    {loading && (
                        <p style={styles.message}>
                            Loading complaints...
                        </p>
                    )}

                    {error && (
                        <p style={styles.error}>
                            {error}
                        </p>
                    )}

                    {!loading && complaints.length === 0 && (
                        <p style={styles.message}>
                            No complaints found.
                        </p>
                    )}

                    {complaints.map((complaint) => (

                        <div
                            key={complaint._id}
                            style={styles.complaint}
                        >

                            <div style={styles.complaintHeader}>

                                <div>
                                    <h3 style={styles.complaintTitle}>
                                        {complaint.title}
                                    </h3>

                                    <p style={styles.student}>
                                        Student:{" "}
                                        {complaint.student?.name ||
                                            "Unknown"}
                                    </p>

                                    <p style={styles.student}>
                                        Email:{" "}
                                        {complaint.student?.email ||
                                            "Unknown"}
                                    </p>
                                </div>

                                <span
                                    style={{
                                        ...styles.status,
                                        ...(complaint.status ===
                                        "resolved"
                                            ? styles.resolved
                                            : complaint.status ===
                                              "in-progress"
                                            ? styles.progress
                                            : styles.pending)
                                    }}
                                >
                                    {complaint.status}
                                </span>

                            </div>

                            <p style={styles.description}>
                                {complaint.description}
                            </p>

                            {complaint.adminResponse && (
                                <div style={styles.response}>
                                    <strong>
                                        Admin Response:
                                    </strong>

                                    <p>
                                        {complaint.adminResponse}
                                    </p>
                                </div>
                            )}

                            {editingId === complaint._id ? (

                                <div style={styles.editBox}>

                                    <label style={styles.label}>
                                        Status
                                    </label>

                                    <select
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(
                                                e.target.value
                                            )
                                        }
                                        style={styles.input}
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>

                                        <option value="in-progress">
                                            In Progress
                                        </option>

                                        <option value="resolved">
                                            Resolved
                                        </option>
                                    </select>

                                    <label style={styles.label}>
                                        Admin Response
                                    </label>

                                    <textarea
                                        value={adminResponse}
                                        onChange={(e) =>
                                            setAdminResponse(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Write response to student..."
                                        rows="4"
                                        style={styles.textarea}
                                    />

                                    <div style={styles.buttons}>

                                        <button
                                            onClick={() =>
                                                updateComplaint(
                                                    complaint._id
                                                )
                                            }
                                            style={styles.updateButton}
                                        >
                                            Save Update
                                        </button>

                                        <button
                                            onClick={cancelEdit}
                                            style={styles.cancelButton}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            ) : (

                                <button
                                    onClick={() =>
                                        startEdit(complaint)
                                    }
                                    style={styles.editButton}
                                >
                                    Update Complaint
                                </button>

                            )}

                        </div>

                    ))}

                </section>

            </main>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f1f5f9",
        color: "#1e293b"
    },

    header: {
        background: "#1e293b",
        color: "white",
        padding: "30px 5%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    title: {
        margin: 0,
        fontSize: "42px"
    },

    subtitle: {
        marginTop: "8px",
        fontSize: "22px"
    },

    logoutButton: {
        background: "#ef4444",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "16px"
    },

    main: {
        width: "90%",
        maxWidth: "1300px",
        margin: "30px auto"
    },

    welcome: {
        textAlign: "center",
        color: "#334155",
        marginBottom: "30px"
    },

    cards: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px"
    },

    card: {
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    },

    cardTitle: {
        fontSize: "22px",
        fontWeight: "700",
        color: "#475569"
    },

    cardNumber: {
        fontSize: "36px",
        fontWeight: "700",
        marginTop: "15px",
        color: "#2563eb"
    },

    section: {
        background: "white",
        marginTop: "30px",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    },

    sectionTitle: {
        color: "#1e293b",
        marginBottom: "25px"
    },

    complaint: {
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "22px",
        marginBottom: "20px",
        background: "#ffffff"
    },

    complaintHeader: {
        display: "flex",
        justifyContent: "space-between",
        gap: "20px"
    },

    complaintTitle: {
        margin: "0 0 8px",
        color: "#1e293b"
    },

    student: {
        margin: "4px 0",
        color: "#64748b"
    },

    description: {
        color: "#334155",
        fontSize: "16px",
        lineHeight: "1.6"
    },

    status: {
        height: "fit-content",
        padding: "7px 14px",
        borderRadius: "20px",
        fontWeight: "700",
        textTransform: "capitalize"
    },

    pending: {
        background: "#fef3c7",
        color: "#92400e"
    },

    progress: {
        background: "#dbeafe",
        color: "#1d4ed8"
    },

    resolved: {
        background: "#dcfce7",
        color: "#166534"
    },

    response: {
        background: "#f0fdf4",
        padding: "15px",
        borderRadius: "8px",
        marginTop: "15px",
        color: "#166534"
    },

    editButton: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "6px",
        cursor: "pointer"
    },

    editBox: {
        marginTop: "20px",
        padding: "20px",
        background: "#f8fafc",
        borderRadius: "8px"
    },

    label: {
        display: "block",
        fontWeight: "600",
        marginBottom: "7px",
        marginTop: "12px"
    },

    input: {
        width: "100%",
        padding: "11px",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        boxSizing: "border-box"
    },

    textarea: {
        width: "100%",
        padding: "11px",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        boxSizing: "border-box",
        resize: "vertical"
    },

    buttons: {
        display: "flex",
        gap: "10px",
        marginTop: "15px"
    },

    updateButton: {
        background: "#16a34a",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "6px",
        cursor: "pointer"
    },

    cancelButton: {
        background: "#64748b",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "6px",
        cursor: "pointer"
    },

    message: {
        color: "#475569"
    },

    error: {
        color: "#dc2626"
    }
};

export default AdminDashboard;