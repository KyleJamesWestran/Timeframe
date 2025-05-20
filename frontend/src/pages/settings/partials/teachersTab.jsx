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
    MenuItem,
    Autocomplete
} from "@mui/material";
import {Edit, Delete, Add} from "@mui/icons-material";

import {
    readTeachers,
    updateTeacher,
    createTeacher,
    deleteTeacher,
    readTitles,
    readSubjects
} from "../../../controllers/settings_controller";
import {imageToBase64, base64ToImage} from "../../../components/helpers";

const TeachersTab = () => {
    const [rows,
        setRows] = useState([]);
    const [titleOptions,
        setTitleOptions] = useState([]);
    const [subjectOptions,
        setSubjectOptions] = useState([]);
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
        picture: null,
        subjects: [], // Array of subject codes
    });

    useEffect(() => {
        fetchTeachers();
        fetchTitleOptions();
        fetchSubjectOptions();
    }, []);

    const fetchTeachers = async() => {
        try {
            const data = await readTeachers();
            const processed = data.map((teacher) => ({
                ...teacher,
                picture: teacher.picture
                    ? base64ToImage(teacher.picture)
                    : null,
                subjects: teacher.subjects || []
            }));
            setRows(processed);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        }
    };

    const fetchTitleOptions = async() => {
        try {
            const data = await readTitles();
            setTitleOptions(data);
        } catch (error) {
            console.error("Error fetching titles:", error);
        }
    };

    const fetchSubjectOptions = async() => {
        try {
            const data = await readSubjects();
            setSubjectOptions(data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const handleOpen = (teacher) => {
        if (teacher && teacher.id) {
            setEditMode(true);
            setForm({
                ...teacher,
                picture: null, // Clear picture to upload new
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
                picture: null,
                subjects: []
            });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = async(e) => {
        const {name, value, files} = e.target;

        if (name === "picture" && files && files[0]) {
            const base64 = await imageToBase64(files[0]);
            setForm((prev) => ({
                ...prev,
                picture: base64
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // For Autocomplete, we need subject objects selected, but form stores codes.
    // So, map codes to subject objects for the value prop
    const selectedSubjectsObjects = subjectOptions.filter((subj) => form.subjects.includes(subj.code));

    const handleSubjectsChange = (event, newValue) => {
        // newValue is array of subject objects, update form.subjects to their codes
        const codes = newValue.map((item) => item.code);
        setForm((prev) => ({
            ...prev,
            subjects: codes
        }));
    };

    const handleSave = async() => {
        try {
            if (!editMode) {
                const {
                    id,
                    ...teacherData
                } = form;
                await createTeacher(teacherData);
            } else {
                await updateTeacher(form.id, form);
            }
            await fetchTeachers();
            handleClose();
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    const handleDelete = async(id) => {
        try {
            await deleteTeacher(id);
            await fetchTeachers();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <div style={{
            padding: 20
        }}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <h2>Teachers</h2>
                <Button
                    variant="contained"
                    startIcon={< Add />}
                    onClick={() => handleOpen(null)}
                    className="btn-primary">
                    New Teacher
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
                            <TableCell>Subjects</TableCell>
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
                                <TableCell>
                                    {row.subjects
                                        ?.map((id) => {
                                            const subj = subjectOptions.find((s) => s.id === id);
                                            return subj
                                                ? subj.name
                                                : "";
                                        })
                                            .filter(Boolean)
                                            .join(", ") || "—"}
                                </TableCell>
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

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode
                        ? "Edit Teacher"
                        : "Add Teacher"}</DialogTitle>
                <DialogContent>
                    {["username", "first_name", "last_name", "email", "phone"].map((field) => (<TextField
                        key={field}
                        margin="dense"
                        name={field}
                        label={field
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
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

                    <Autocomplete
                        multiple
                        options={subjectOptions}
                        getOptionLabel={(option) => `${option.name}`}
                        value={subjectOptions.filter((t) => form.subjects.includes(t.id))}
                        onChange={(event, newValue) => {
                        setForm({
                            ...form,
                            subjects: newValue.map((t) => t.id)
                        });
                    }}
                        renderInput={(params) => (<TextField {...params} label="Subjects" margin="dense"/>)}
                        sx={{
                        mt: 2
                    }}/>

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
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>
                        {editMode
                            ? "Update"
                            : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TeachersTab;
