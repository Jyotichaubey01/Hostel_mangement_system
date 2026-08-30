import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function StudentDashboard() {
    const [user, setUser] = useState(null);
    const [fees, setFees] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!savedUser || !token) {
            window.location.href = "/login";
            return;
        }

        const loggedUser = JSON.parse(savedUser);

        if (loggedUser.role !== "student") {
            window.location.href = "/admin";
            return;
        }

        setUser(loggedUser);

        loadDashboard(loggedUser.id, token);
    }, []);

    const loadDashboard = async (studentId, token) => {
        try {
            setLoading(true);
            setError("");

            const headers = {
                Authorization: `Bearer ${token}`
            };

            const [feesResponse, complaintsResponse, roomsResponse] =
                await Promise.all([
                    axios.get(
                        `${API_URL}/api/fees/student/${studentId}`,
                        { headers }
                    ),

                    axios.get(
                        `${API_URL}/api/complaints/my`,
                        { headers }
                    ),

                    axios.get(
                        `${API_URL}/api/rooms`,
                        { headers }
                    )
                ]);

            setFees(feesResponse.data.fees || []);

            setComplaints(
                complaintsResponse.data.complaints || []
            );

            setRooms(roomsResponse.data.rooms || []);

        } catch (err) {
            console.error("Dashboard error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard data."
            );

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div style={styles.center}>
                <h2>Loading Student Dashboard...</h2>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const pendingFees = fees.filter(
        (fee) => fee.status === "pending"
    );

    const paidFees = fees.filter(
        (fee) => fee.status === "paid"
    );

    const pendingComplaints = complaints.filter(
        (complaint) => complaint.status === "pending"
    );

    const resolvedComplaints = complaints.filter(
        (complaint) => complaint.status === "resolved"
    );

    return (
        <div style={styles.page}>

            {/* HEADER */}
            <header style={styles.header}>

                <div>
                    <h1>Hostel Management System</h1>
                    <p>Student Dashboard</p>
                </div>

                <button
                    onClick={logout}
                    style={styles.logout}
                >
                    Logout
                </button>

            </header>

            {/* MAIN */}
            <main style={styles.container}>

                <h2>
                    Welcome, {user.name} 👋
                </h2>

                <p>
                    Email: {user.email}
                </p>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                {/* STATISTICS */}
                <div style={styles.cards}>

                    <div style={styles.card}>
                        <h3>🛏️ Available Rooms</h3>
                        <p style={styles.number}>
                            {rooms.length}
                        </p>
                    </div>

                    <div style={styles.card}>
                        <h3>💰 Total Fees</h3>
                        <p style={styles.number}>
                            {fees.length}
                        </p>
                    </div>

                    <div style={styles.card}>
                        <h3>⏳ Pending Fees</h3>
                        <p style={styles.number}>
                            {pendingFees.length}
                        </p>
                    </div>

                    <div style={styles.card}>
                        <h3>📝 Complaints</h3>
                        <p style={styles.number}>
                            {complaints.length}
                        </p>
                    </div>

                </div>

                {/* FEES */}
                <section style={styles.section}>

                    <h2>My Fees</h2>

                    {fees.length === 0 ? (
                        <p>No fees assigned.</p>
                    ) : (
                        <div style={styles.tableContainer}>

                            <table style={styles.table}>

                                <thead>
                                    <tr>
                                        <th>Fee Type</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {fees.map((fee) => (
                                        <tr key={fee._id}>

                                            <td>
                                                {fee.feeType}
                                            </td>

                                            <td>
                                                ₹{fee.amount}
                                            </td>

                                            <td>
                                                {new Date(
                                                    fee.dueDate
                                                ).toLocaleDateString()}
                                            </td>

                                            <td>

                                                <span
                                                    style={{
                                                        ...styles.status,

                                                        ...(fee.status === "paid"
                                                            ? styles.paid
                                                            : styles.pending)
                                                    }}
                                                >
                                                    {fee.status}
                                                </span>

                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

                {/* COMPLAINTS */}
                <section style={styles.section}>

                    <h2>My Complaints</h2>

                    {complaints.length === 0 ? (
                        <p>No complaints submitted.</p>
                    ) : (

                        complaints.map((complaint) => (

                            <div
                                key={complaint._id}
                                style={styles.complaint}
                            >

                                <h3>
                                    {complaint.title}
                                </h3>

                                <p>
                                    {complaint.description}
                                </p>

                                <p>
                                    <strong>
                                        Status:
                                    </strong>{" "}

                                    <span
                                        style={{
                                            ...styles.status,

                                            ...(complaint.status === "resolved"
                                                ? styles.paid
                                                : styles.pending)
                                        }}
                                    >
                                        {complaint.status}
                                    </span>
                                </p>

                                {complaint.adminResponse && (
                                    <p>
                                        <strong>
                                            Admin Response:
                                        </strong>{" "}
                                        {complaint.adminResponse}
                                    </p>
                                )}

                            </div>

                        ))

                    )}

                </section>

                {/* SUMMARY */}
                <section style={styles.section}>

                    <h2>Complaint Summary</h2>

                    <p>
                        Pending: {pendingComplaints.length}
                    </p>

                    <p>
                        Resolved: {resolvedComplaints.length}
                    </p>

                    <p>
                        Paid Fees: {paidFees.length}
                    </p>

                </section>

            </main>

        </div>
    );
}

const styles = {

    page: {
        minHeight: "100vh",
        background: "#f4f6f8"
    },

    header: {
        background: "#1e293b",
        color: "white",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    container: {
        maxWidth: "1200px",
        margin: "auto",
        padding: "30px"
    },

    center: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },

    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginTop: "25px"
    },

    card: {
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
    },

    number: {
        fontSize: "30px",
        fontWeight: "bold",
        margin: "10px 0"
    },

    section: {
        background: "white",
        marginTop: "30px",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)"
    },

    tableContainer: {
        overflowX: "auto"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse"
    },

    status: {
        padding: "5px 10px",
        borderRadius: "15px",
        fontWeight: "bold"
    },

    paid: {
        background: "#dcfce7",
        color: "#166534"
    },

    pending: {
        background: "#fef3c7",
        color: "#92400e"
    },

    complaint: {
        borderBottom: "1px solid #ddd",
        padding: "15px 0"
    },

    error: {
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "12px",
        borderRadius: "6px",
        marginTop: "15px"
    },

    logout: {
        padding: "10px 20px",
        background: "#dc2626",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }
};

export default StudentDashboard;