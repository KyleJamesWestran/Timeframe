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
    Autocomplete
} from "@mui/material";
import {Edit, Delete, Add} from "@mui/icons-material";
import {
    readSubjects,
    updateSubject,
    createSubject,
    deleteSubject,
    readTitles,
    readTeachers
} from "../../../controllers/settings_controller";
import {base64ToImage} from "../../../components/helpers";

const SubjectsTab = () => {
    const [rows,
        setRows] = useState([]);
    const [titleOptions,
        setTitleOptions] = useState([]);
    const [teacherOptions,
        setTeacherOptions] = useState([]);
    const [open,
        setOpen] = useState(false);
    const [editMode,
        setEditMode] = useState(false);

    const [form,
        setForm] = useState({id: null, name: "", teachers: []});

    useEffect(() => {
        fetchSubjects();
        fetchTitleOptions();
        fetchTeacherOptions();
    }, []);

    const fetchSubjects = async() => {
        try {
            const data = await readSubjects();
            const processed = data.map((subject) => ({
                ...subject,
                picture: subject.picture
                    ? base64ToImage(subject.picture)
                    : null
            }));
            setRows(processed);
        } catch (error) {
            console.error("Error fetching subjects:", error);
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

    const fetchTeacherOptions = async() => {
        try {
            const data = await readTeachers();
            setTeacherOptions(data);
        } catch (error) {
            console.error("Error fetching teacher options:", error);
        }
    };

    const handleOpen = (subject) => {
        if (subject && subject.id) {
            setEditMode(true);
            setForm({
                ...subject,
                picture: null,
                teachers: subject.teachers
                    ?.map(t => t.id) || []
            });
        } else {
            setEditMode(false);
            setForm({id: null, name: "", teachers: []});
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSave = async() => {
        try {
            const {
                id,
                ...subjectData
            } = form;
            if (!editMode) {
                await createSubject(subjectData);
            } else {
                await updateSubject(id, subjectData);
            }
            await fetchSubjects();
            handleClose();
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    const handleDelete = async(id) => {
        try {
            await deleteSubject(id);
            await fetchSubjects();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <div style={{
            padding: 20
        }}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <h2>Subjects</h2>
                <Button
                    variant="contained"
                    startIcon={< Add />}
                    onClick={handleOpen}
                    className="btn-primary">
                    New Subject
                </Button>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Teachers</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>
                                    {row.teachers
                                        ?.map(t => {
                                            const teacher = teacherOptions.find(opt => opt.id === t);
                                            return teacher
                                                ? `${teacher.first_name} ${teacher.last_name}`
                                                : "";
                                        }).join(", ") || "—"}
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

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editMode
                        ? "Edit Subject"
                        : "Add Subject"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Name"
                        fullWidth
                        value={form.name}
                        onChange={handleChange}/>

                    <Autocomplete
                        multiple
                        options={teacherOptions}
                        getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                        value={teacherOptions.filter((t) => form.teachers.includes(t.id))}
                        onChange={(event, newValue) => {
                        setForm({
                            ...form,
                            teachers: newValue.map((t) => t.id)
                        });
                    }}
                        renderInput={(params) => (<TextField {...params} label="Teachers" margin="dense"/>)}
                        sx={{
                        mt: 2
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

export default SubjectsTab;
