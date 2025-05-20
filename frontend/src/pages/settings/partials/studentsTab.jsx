import React, {useState, useEffect} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Stack,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import {Edit, Delete, Add} from "@mui/icons-material";
import {
    readStudents, updateStudent, createStudent, deleteStudent, readTitles // <-- Make sure this is imported
} from "../../../controllers/settings_controller";
import { imageToBase64, base64ToImage } from "../../../components/helpers";

const StudentsTab = () => {
    const [rows,
        setRows] = useState([]);
    const [titleOptions,
        setTitleOptions] = useState([]);
    const [open,
        setOpen] = useState(false);
    const [editMode,
        setEditMode] = useState(false);
    const [form,
        setForm] = useState({
        id: null,
        username: "",
        title: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        picture: null
    });

    useEffect(() => {
        fetchStudents();
        fetchTitleOptions();
    }, []);

    const fetchStudents = async () => {
        try {
            const data = await readStudents();
    
            const processed = data.map((student) => ({
                ...student,
                picture: student.picture
                    ? base64ToImage(student.picture) // <-- Convert to data URL
                    : null
            }));
    
            setRows(processed);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const fetchTitleOptions = async() => {
        try {
            const data = await readTitles();
            setTitleOptions(data);
        } catch (error) {
            console.error("Error fetching title options:", error);
        }
    };

    const handleOpen = (student) => {
        if (student && student.id) {
            setEditMode(true);
            setForm({
                ...student,
                picture: null
            });
        } else {
            setEditMode(false);
            setForm({
                id: null,
                username: "",
                title: "",
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                picture: null
            });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = async (e) => {
        const { name, value, files } = e.target;
    
        if (name === "picture" && files && files[0]) {
            const base64 = await imageToBase64(files[0]);
            setForm({
                ...form,
                picture: base64
            });
        } else {
            setForm({
                ...form,
                [name]: value
            });
        }
    };

    const handleSave = async () => {
        try {
            if (!editMode) {
                const { id, ...studentData } = form;
                await createStudent(studentData); // now just plain JSON
            } else {
                await updateStudent(form.id, form);
            }
    
            await fetchStudents();
            handleClose();
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    const handleDelete = async(id) => {
        try {
            await deleteStudent(id);
            await fetchStudents();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <div style={{
            padding: 20
        }}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <h2>Students</h2>
                <Button
                    variant="contained"
                    startIcon={< Add />}
                    onClick={handleOpen}
                    className="btn-primary">
                    New Student
                </Button>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Picture</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    {row.picture
                                        ? (<Avatar src={row.picture} alt={row.first_name}/>)
                                        : (
                                            <Avatar>{row.first_name
                                                    ?.charAt(0)}</Avatar>
                                        )}
                                </TableCell>
                                <TableCell>{row.username}</TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.first_name}</TableCell>
                                <TableCell>{row.last_name}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.phone}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpen(row)}>
                                        <Edit/>
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                        <Delete/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editMode
                        ? "Edit Student"
                        : "Add Student"}</DialogTitle>
                <DialogContent>
                    {["username", "first_name", "last_name", "email", "phone"].map((field) => (<TextField
                        key={field}
                        margin="dense"
                        name={field}
                        label={field
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                        fullWidth
                        value={form[field]}
                        onChange={handleChange}/>))}

                    <FormControl fullWidth margin="dense">
                        <InputLabel id="title-label">Title</InputLabel>
                        <Select
                            labelId="title-label"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            label="Title">
                            {titleOptions.map((option) => (
                                <MenuItem key={option.key} value={option.label}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        margin="dense"
                        name="picture"
                        type="file"
                        fullWidth
                        onChange={handleChange}
                        InputLabelProps={{
                        shrink: true
                    }}/>
                </DialogContent>
                <DialogActions>
                    <Button className="btn-primary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className="btn-primary" variant="contained" onClick={handleSave}>
                        {editMode
                            ? "Update"
                            : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default StudentsTab;
