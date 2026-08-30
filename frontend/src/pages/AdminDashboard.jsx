import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function AdminDashboard() {
    const token = localStorage.getItem("token");

    // ==============================
    // STATE
    // ==============================

    const [complaints, setComplaints] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [fees, setFees] = useState([]);

    const [loadingComplaints, setLoadingComplaints] = useState(true);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [loadingFees, setLoadingFees] = useState(true);

    const [complaintError, setComplaintError] = useState("");
    const [roomError, setRoomError] = useState("");
    const [feeError, setFeeError] = useState("");

    // Complaint editing
    const [editingComplaintId, setEditingComplaintId] = useState(null);
    const [complaintStatus, setComplaintStatus] = useState("");
    const [adminResponse, setAdminResponse] = useState("");

    // Room form
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [editingRoomId, setEditingRoomId] = useState(null);
    const [roomNumber, setRoomNumber] = useState("");
    const [capacity, setCapacity] = useState("");
    const [occupied, setOccupied] = useState("");
    const [roomLoading, setRoomLoading] = useState(false);

    // Fee form
    const [showFeeForm, setShowFeeForm] = useState(false);
    const [feeLoading, setFeeLoading] = useState(false);

    const [feeStudentId, setFeeStudentId] = useState("");
    const [feeAmount, setFeeAmount] = useState("");
    const [feeType, setFeeType] = useState("hostel");
    const [feeDueDate, setFeeDueDate] = useState("");

    // ==============================
    // AUTH HEADERS
    // ==============================

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    // ==============================
    // GET COMPLAINTS
    // ==============================

    const getComplaints = async () => {
        try {
            setLoadingComplaints(true);

            const response = await axios.get(
                `${API_URL}/api/complaints`,
                { headers }
            );

            setComplaints(response.data.complaints || []);
            setComplaintError("");
        } catch (error) {
            console.error("Complaint Error:", error);

            setComplaintError(
                error.response?.data?.message ||
                "Unable to load complaints."
            );
        } finally {
            setLoadingComplaints(false);
        }
    };

    // ==============================
    // GET ROOMS
    // ==============================

    const getRooms = async () => {
        try {
            setLoadingRooms(true);

            const response = await axios.get(
                `${API_URL}/api/rooms`,
                { headers }
            );

            const roomData =
                response.data.rooms ||
                response.data;

            setRooms(
                Array.isArray(roomData)
                    ? roomData
                    : []
            );

            setRoomError("");
        } catch (error) {
            console.error("Room Error:", error);

            setRoomError(
                error.response?.data?.message ||
                "Unable to load rooms."
            );
        } finally {
            setLoadingRooms(false);
        }
    };

    // ==============================
    // GET FEES
    // ==============================

    const getFees = async () => {
        try {
            setLoadingFees(true);

            const response = await axios.get(
                `${API_URL}/api/fees`,
                { headers }
            );

            setFees(response.data.fees || []);
            setFeeError("");
        } catch (error) {
            console.error("Fee Error:", error);

            setFeeError(
                error.response?.data?.message ||
                "Unable to load fees."
            );
        } finally {
            setLoadingFees(false);
        }
    };

    // ==============================
    // LOAD DATA
    // ==============================

    useEffect(() => {
        if (!token) {
            window.location.href = "/login";
            return;
        }

        getComplaints();
        getRooms();
        getFees();
    }, []);

    // ==============================
    // COMPLAINT EDIT
    // ==============================

    const startComplaintEdit = (complaint) => {
        setEditingComplaintId(complaint._id);
        setComplaintStatus(complaint.status);
        setAdminResponse(complaint.adminResponse || "");
    };

    const cancelComplaintEdit = () => {
        setEditingComplaintId(null);
        setComplaintStatus("");
        setAdminResponse("");
    };

    const updateComplaint = async (id) => {
        try {
            await axios.put(
                `${API_URL}/api/complaints/${id}`,
                {
                    status: complaintStatus,
                    adminResponse
                },
                { headers }
            );

            alert("Complaint updated successfully.");

            cancelComplaintEdit();
            getComplaints();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update complaint."
            );
        }
    };

    // ==============================
    // ROOM FORM
    // ==============================

    const resetRoomForm = () => {
        setRoomNumber("");
        setCapacity("");
        setOccupied("");
        setEditingRoomId(null);
        setShowRoomForm(false);
    };

    const startRoomEdit = (room) => {
        setEditingRoomId(room._id);

        setRoomNumber(room.roomNumber || "");
        setCapacity(room.capacity ?? "");
        setOccupied(room.occupied ?? 0);

        setShowRoomForm(true);
    };

    // ==============================
    // ADD / UPDATE ROOM
    // ==============================

    const saveRoom = async (e) => {
        e.preventDefault();

        if (!roomNumber || !capacity) {
            alert("Please enter room number and capacity.");
            return;
        }

        if (Number(occupied || 0) > Number(capacity)) {
            alert("Occupied students cannot exceed capacity.");
            return;
        }

        try {
            setRoomLoading(true);

            const roomData = {
                roomNumber,
                capacity: Number(capacity),
                occupied: Number(occupied || 0)
            };

            if (editingRoomId) {
                await axios.put(
                    `${API_URL}/api/rooms/${editingRoomId}`,
                    roomData,
                    { headers }
                );

                alert("Room updated successfully.");
            } else {
                await axios.post(
                    `${API_URL}/api/rooms`,
                    roomData,
                    { headers }
                );

                alert("Room added successfully.");
            }

            resetRoomForm();
            getRooms();
        } catch (error) {
            console.error("Room Save Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to save room."
            );
        } finally {
            setRoomLoading(false);
        }
    };

    // ==============================
    // DELETE ROOM
    // ==============================

    const deleteRoom = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this room?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(
                `${API_URL}/api/rooms/${id}`,
                { headers }
            );

            alert("Room deleted successfully.");
            getRooms();
        } catch (error) {
            console.error("Delete Room Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete room."
            );
        }
    };

    // ==============================
    // FEE FORM
    // ==============================

    const resetFeeForm = () => {
        setFeeStudentId("");
        setFeeAmount("");
        setFeeType("hostel");
        setFeeDueDate("");
        setShowFeeForm(false);
    };

    // ==============================
    // ADD FEE
    // ==============================

    const saveFee = async (e) => {
        e.preventDefault();

        if (!feeStudentId || !feeAmount || !feeDueDate) {
            alert("Please fill all fee details.");
            return;
        }

        try {
            setFeeLoading(true);

            const feeData = {
                student: feeStudentId,
                amount: Number(feeAmount),
                feeType,
                dueDate: feeDueDate
            };

            await axios.post(
                `${API_URL}/api/fees`,
                feeData,
                { headers }
            );

            alert("Fee added successfully.");

            resetFeeForm();
            getFees();
        } catch (error) {
            console.error("Fee Save Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to add fee."
            );
        } finally {
            setFeeLoading(false);
        }
    };

    // ==============================
    // MARK FEE PAID
    // ==============================

    const markFeePaid = async (id) => {
        const confirmPayment = window.confirm(
            "Mark this fee as paid?"
        );

        if (!confirmPayment) return;

        try {
            await axios.put(
                `${API_URL}/api/fees/${id}/pay`,
                {},
                { headers }
            );

            alert("Fee marked as paid.");
            getFees();
        } catch (error) {
            console.error("Fee Payment Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to mark fee as paid."
            );
        }
    };

    // ==============================
    // DELETE FEE
    // ==============================

    const deleteFee = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this fee?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(
                `${API_URL}/api/fees/${id}`,
                { headers }
            );

            alert("Fee deleted successfully.");
            getFees();
        } catch (error) {
            console.error("Delete Fee Error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete fee."
            );
        }
    };

    // ==============================
    // LOGOUT
    // ==============================

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    // ==============================
    // STATISTICS
    // ==============================

    const pendingComplaints = complaints.filter(
        (complaint) => complaint.status === "pending"
    ).length;

    const resolvedComplaints = complaints.filter(
        (complaint) => complaint.status === "resolved"
    ).length;

    const totalRooms = rooms.length;

    const totalCapacity = rooms.reduce(
        (total, room) =>
            total + Number(room.capacity || 0),
        0
    );

    const totalOccupied = rooms.reduce(
        (total, room) =>
            total + Number(room.occupied || 0),
        0
    );

    const totalFees = fees.reduce(
        (total, fee) =>
            total + Number(fee.amount || 0),
        0
    );

    const paidFees = fees
        .filter((fee) => fee.status === "paid")
        .reduce(
            (total, fee) =>
                total + Number(fee.amount || 0),
            0
        );

    const pendingFees = fees
        .filter((fee) => fee.status !== "paid")
        .reduce(
            (total, fee) =>
                total + Number(fee.amount || 0),
            0
        );

    // ==============================
    // UI
    // ==============================

    return (
        <div style={styles.page}>

            {/* HEADER */}

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

                {/* STATISTICS */}

                <div style={styles.cards}>

                    <div style={styles.card}>
                        <div style={styles.cardTitle}>
                            🛏️ Total Rooms
                        </div>

                        <div style={styles.cardNumber}>
                            {totalRooms}
                        </div>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.cardTitle}>
                            👥 Occupied
                        </div>

                        <div style={styles.cardNumber}>
                            {totalOccupied}/{totalCapacity}
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
                            {pendingComplaints}
                        </div>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.cardTitle}>
                            💰 Total Fees
                        </div>

                        <div style={styles.cardNumber}>
                            ₹{totalFees.toLocaleString("en-IN")}
                        </div>
                    </div>

                </div>

                {/* ROOMS */}

                <section style={styles.section}>

                    <div style={styles.sectionHeader}>

                        <h2 style={styles.sectionTitle}>
                            🛏️ Room Management
                        </h2>

                        <button
                            onClick={() => {
                                resetRoomForm();
                                setShowRoomForm(true);
                            }}
                            style={styles.addButton}
                        >
                            + Add Room
                        </button>

                    </div>

                    {showRoomForm && (

                        <form
                            onSubmit={saveRoom}
                            style={styles.form}
                        >

                            <h3>
                                {editingRoomId
                                    ? "Edit Room"
                                    : "Add New Room"}
                            </h3>

                            <label style={styles.label}>
                                Room Number
                            </label>

                            <input
                                type="text"
                                value={roomNumber}
                                onChange={(e) =>
                                    setRoomNumber(e.target.value)
                                }
                                placeholder="Example: A-101"
                                style={styles.input}
                                required
                            />

                            <label style={styles.label}>
                                Capacity
                            </label>

                            <input
                                type="number"
                                min="1"
                                value={capacity}
                                onChange={(e) =>
                                    setCapacity(e.target.value)
                                }
                                placeholder="Example: 4"
                                style={styles.input}
                                required
                            />

                            <label style={styles.label}>
                                Occupied
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={occupied}
                                onChange={(e) =>
                                    setOccupied(e.target.value)
                                }
                                placeholder="Example: 2"
                                style={styles.input}
                            />

                            <div style={styles.buttons}>

                                <button
                                    type="submit"
                                    disabled={roomLoading}
                                    style={styles.updateButton}
                                >
                                    {roomLoading
                                        ? "Saving..."
                                        : editingRoomId
                                        ? "Update Room"
                                        : "Add Room"}
                                </button>

                                <button
                                    type="button"
                                    onClick={resetRoomForm}
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>
                    )}

                    {roomError && (
                        <p style={styles.error}>
                            {roomError}
                        </p>
                    )}

                    {loadingRooms && (
                        <p style={styles.message}>
                            Loading rooms...
                        </p>
                    )}

                    {!loadingRooms &&
                        rooms.length === 0 &&
                        !roomError && (
                            <p style={styles.message}>
                                No rooms found.
                            </p>
                        )}

                    <div style={styles.roomGrid}>

                        {rooms.map((room) => {

                            const available = Math.max(
                                Number(room.capacity || 0) -
                                Number(room.occupied || 0),
                                0
                            );

                            return (
                                <div
                                    key={room._id}
                                    style={styles.roomCard}
                                >

                                    <h3>
                                        Room {room.roomNumber}
                                    </h3>

                                    <p>
                                        Capacity: {room.capacity}
                                    </p>

                                    <p>
                                        Occupied: {room.occupied || 0}
                                    </p>

                                    <p>
                                        Available: {available}
                                    </p>

                                    <div style={styles.buttons}>

                                        <button
                                            onClick={() =>
                                                startRoomEdit(room)
                                            }
                                            style={styles.editButton}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteRoom(room._id)
                                            }
                                            style={styles.deleteButton}
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </section>

                {/* COMPLAINTS */}

                <section style={styles.section}>

                    <div style={styles.sectionHeader}>

                        <h2 style={styles.sectionTitle}>
                            📝 Complaint Management
                        </h2>

                        <div>
                            Resolved:{" "}
                            <strong>
                                {resolvedComplaints}
                            </strong>
                        </div>

                    </div>

                    {loadingComplaints && (
                        <p style={styles.message}>
                            Loading complaints...
                        </p>
                    )}

                    {complaintError && (
                        <p style={styles.error}>
                            {complaintError}
                        </p>
                    )}

                    {!loadingComplaints &&
                        complaints.length === 0 && (
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
                                        {complaint.student?.name}
                                    </p>

                                    <p style={styles.student}>
                                        Email:{" "}
                                        {complaint.student?.email}
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

                            {editingComplaintId ===
                            complaint._id ? (

                                <div style={styles.editBox}>

                                    <label style={styles.label}>
                                        Status
                                    </label>

                                    <select
                                        value={complaintStatus}
                                        onChange={(e) =>
                                            setComplaintStatus(
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
                                            onClick={
                                                cancelComplaintEdit
                                            }
                                            style={styles.cancelButton}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            ) : (

                                <button
                                    onClick={() =>
                                        startComplaintEdit(
                                            complaint
                                        )
                                    }
                                    style={styles.editButton}
                                >
                                    Update Complaint
                                </button>

                            )}

                        </div>
                    ))}

                </section>

                {/* FEES */}

                <section style={styles.section}>

                    <div style={styles.sectionHeader}>

                        <h2 style={styles.sectionTitle}>
                            💰 Fee Management
                        </h2>

                        <button
                            onClick={() => setShowFeeForm(true)}
                            style={styles.addButton}
                        >
                            + Add Fee
                        </button>

                    </div>

                    {/* FEE SUMMARY */}

                    <div style={styles.feeSummary}>

                        <div style={styles.feeSummaryCard}>
                            <span>Total</span>
                            <strong>
                                ₹{totalFees.toLocaleString("en-IN")}
                            </strong>
                        </div>

                        <div style={styles.feeSummaryCard}>
                            <span>Paid</span>
                            <strong>
                                ₹{paidFees.toLocaleString("en-IN")}
                            </strong>
                        </div>

                        <div style={styles.feeSummaryCard}>
                            <span>Pending</span>
                            <strong>
                                ₹{pendingFees.toLocaleString("en-IN")}
                            </strong>
                        </div>

                    </div>

                    {/* ADD FEE FORM */}

                    {showFeeForm && (

                        <form
                            onSubmit={saveFee}
                            style={styles.form}
                        >

                            <h3>Add New Fee</h3>

                            <label style={styles.label}>
                                Student ID
                            </label>

                            <input
                                type="text"
                                value={feeStudentId}
                                onChange={(e) =>
                                    setFeeStudentId(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter student ID"
                                style={styles.input}
                                required
                            />

                            <label style={styles.label}>
                                Amount
                            </label>

                            <input
                                type="number"
                                min="1"
                                value={feeAmount}
                                onChange={(e) =>
                                    setFeeAmount(
                                        e.target.value
                                    )
                                }
                                placeholder="Example: 5000"
                                style={styles.input}
                                required
                            />

                            <label style={styles.label}>
                                Fee Type
                            </label>

                            <select
                                value={feeType}
                                onChange={(e) =>
                                    setFeeType(
                                        e.target.value
                                    )
                                }
                                style={styles.input}
                            >
                                <option value="hostel">
                                    Hostel
                                </option>

                                <option value="mess">
                                    Mess
                                </option>

                                <option value="other">
                                    Other
                                </option>
                            </select>

                            <label style={styles.label}>
                                Due Date
                            </label>

                            <input
                                type="date"
                                value={feeDueDate}
                                onChange={(e) =>
                                    setFeeDueDate(
                                        e.target.value
                                    )
                                }
                                style={styles.input}
                                required
                            />

                            <div style={styles.buttons}>

                                <button
                                    type="submit"
                                    disabled={feeLoading}
                                    style={styles.updateButton}
                                >
                                    {feeLoading
                                        ? "Adding..."
                                        : "Add Fee"}
                                </button>

                                <button
                                    type="button"
                                    onClick={resetFeeForm}
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>
                    )}

                    {feeError && (
                        <p style={styles.error}>
                            {feeError}
                        </p>
                    )}

                    {loadingFees && (
                        <p style={styles.message}>
                            Loading fees...
                        </p>
                    )}

                    {!loadingFees &&
                        fees.length === 0 &&
                        !feeError && (
                            <p style={styles.message}>
                                No fees found.
                            </p>
                        )}

                    {/* FEE LIST */}

                    {!loadingFees &&
                        fees.length > 0 && (

                            <div style={styles.feeTableWrapper}>

                                <table style={styles.table}>

                                    <thead>

                                        <tr>
                                            <th style={styles.th}>
                                                Student
                                            </th>

                                            <th style={styles.th}>
                                                Fee Type
                                            </th>

                                            <th style={styles.th}>
                                                Amount
                                            </th>

                                            <th style={styles.th}>
                                                Due Date
                                            </th>

                                            <th style={styles.th}>
                                                Status
                                            </th>

                                            <th style={styles.th}>
                                                Action
                                            </th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {fees.map((fee) => (

                                            <tr key={fee._id}>

                                                <td style={styles.td}>
                                                    <strong>
                                                        {fee.student?.name ||
                                                            "Unknown"}
                                                    </strong>

                                                    <br />

                                                    <small>
                                                        {fee.student?.email ||
                                                            ""}
                                                    </small>
                                                </td>

                                                <td style={styles.td}>
                                                    {fee.feeType}
                                                </td>

                                                <td style={styles.td}>
                                                    ₹
                                                    {Number(
                                                        fee.amount || 0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </td>

                                                <td style={styles.td}>
                                                    {fee.dueDate
                                                        ? new Date(
                                                              fee.dueDate
                                                          ).toLocaleDateString(
                                                              "en-IN"
                                                          )
                                                        : "-"}
                                                </td>

                                                <td style={styles.td}>

                                                    <span
                                                        style={{
                                                            ...styles.status,
                                                            ...(fee.status ===
                                                            "paid"
                                                                ? styles.resolved
                                                                : styles.pending)
                                                        }}
                                                    >
                                                        {fee.status}
                                                    </span>

                                                </td>

                                                <td style={styles.td}>

                                                    <div
                                                        style={
                                                            styles.buttons
                                                        }
                                                    >

                                                        {fee.status !==
                                                            "paid" && (

                                                            <button
                                                                onClick={() =>
                                                                    markFeePaid(
                                                                        fee._id
                                                                    )
                                                                }
                                                                style={
                                                                    styles.updateButton
                                                                }
                                                            >
                                                                Mark Paid
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() =>
                                                                deleteFee(
                                                                    fee._id
                                                                )
                                                            }
                                                            style={
                                                                styles.deleteButton
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>
                        )}

                </section>

            </main>
        </div>
    );
}

// ======================================================
// STYLES
// ======================================================

const styles = {

    page: {
        minHeight: "100vh",
        background: "#f1f5f9",
        color: "#1e293b"
    },

    header: {
        background: "#1e293b",
        color: "white",
        padding: "25px 5%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    title: {
        margin: 0,
        fontSize: "36px"
    },

    subtitle: {
        marginTop: "8px",
        fontSize: "20px"
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
        padding: "25px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)"
    },

    cardTitle: {
        fontSize: "17px",
        fontWeight: "700",
        color: "#475569"
    },

    cardNumber: {
        fontSize: "30px",
        fontWeight: "700",
        marginTop: "12px",
        color: "#2563eb"
    },

    section: {
        background: "white",
        marginTop: "30px",
        padding: "30px",
        borderRadius: "12px",
        boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)"
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        gap: "15px"
    },

    sectionTitle: {
        margin: 0
    },

    addButton: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "11px 18px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "15px"
    },

    form: {
        background: "#f8fafc",
        padding: "22px",
        borderRadius: "10px",
        marginBottom: "25px"
    },

    label: {
        display: "block",
        fontWeight: "600",
        marginTop: "12px",
        marginBottom: "7px"
    },

    input: {
        width: "100%",
        padding: "11px",
        boxSizing: "border-box",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        fontSize: "15px"
    },

    textarea: {
        width: "100%",
        padding: "11px",
        boxSizing: "border-box",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        resize: "vertical"
    },

    roomGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px"
    },

    roomCard: {
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "20px",
        background: "#ffffff"
    },

    buttons: {
        display: "flex",
        gap: "10px",
        marginTop: "15px",
        flexWrap: "wrap"
    },

    editButton: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "9px 16px",
        borderRadius: "6px",
        cursor: "pointer"
    },

    deleteButton: {
        background: "#dc2626",
        color: "white",
        border: "none",
        padding: "9px 16px",
        borderRadius: "6px",
        cursor: "pointer"
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

    editBox: {
        marginTop: "20px",
        padding: "20px",
        background: "#f8fafc",
        borderRadius: "8px"
    },

    complaint: {
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "22px",
        marginBottom: "20px"
    },

    complaintHeader: {
        display: "flex",
        justifyContent: "space-between",
        gap: "20px"
    },

    complaintTitle: {
        margin: "0 0 8px"
    },

    student: {
        margin: "4px 0",
        color: "#64748b"
    },

    description: {
        lineHeight: "1.6"
    },

    status: {
        height: "fit-content",
        padding: "7px 14px",
        borderRadius: "20px",
        fontWeight: "700",
        textTransform: "capitalize",
        display: "inline-block"
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

    feeSummary: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "15px",
        marginBottom: "25px"
    },

    feeSummaryCard: {
        background: "#f8fafc",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse"
    },

    th: {
        textAlign: "left",
        padding: "14px",
        background: "#f1f5f9",
        borderBottom: "1px solid #cbd5e1"
    },

    td: {
        padding: "14px",
        borderBottom: "1px solid #e2e8f0",
        verticalAlign: "top"
    },

    feeTableWrapper: {
        overflowX: "auto"
    },

    message: {
        color: "#64748b"
    },

    error: {
        color: "#dc2626",
        background: "#fee2e2",
        padding: "12px",
        borderRadius: "7px"
    }
};

export default AdminDashboard;