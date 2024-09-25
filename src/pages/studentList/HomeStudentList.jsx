import React, { useState, useEffect } from "react";
import { Button, Table, Label, TextInput, Modal } from "flowbite-react"; // Assuming 'Select' component exists in your UI library
import Axios from "axios";
import { useQuery } from "@tanstack/react-query";

function HomeStudentList() {
  const [usn, setUsn] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [academicLevel, setAcademicLevel] = useState(""); // State for selected academic level
  const [term, setTerm] = useState(""); // State for selected academic level
  const [studentList, setStudentList] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [emailValid, setEmailValid] = useState(true);
  const [usnValid, setUsnValid] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const env = import.meta.env;
  const serverURL = env.VITE_REACT_SERVER_URL;

  const { data,isLoading,isError } = useQuery({
    queryKey:['department'],
  })

  const studentsPerPage = 20;

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    fetchStudentList();
  }, [currentPage]); // Fetch list whenever currentPage changes

  const fetchStudentList = async () => {
    try {
      const response = await Axios.get(
        `${serverURL}/osc/api/getStudentList?page=${currentPage}&limit=${studentsPerPage}`
      );
      setStudentList(response.data);
    } catch (error) {
      console.error("Error fetching student list", error);
    }
  };

  const usnChange = (e) => {
    const newUsn = e.target.value;
    // Validate the format (only numbers and exactly 11 digits)
    const isValidUsn = /^\d{11}$/.test(newUsn);
    setUsn(newUsn);
    setUsnValid(isValidUsn);
  };

  const academicChange = (e) => setAcademicLevel(e.target.value); // Update academic level state with selected value

  const programChange = (e) => setProgram(e.target.value);
  const nameChange = (e) => setName(e.target.value);
  const emailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailValid(isValidEmail(newEmail));
  };

  const resetForm = () => {
    setUsn("");
    setEmail("");
    setName("");
    setProgram("");
    setAcademicLevel(""); // Reset academic level state
    setUsnValid(true); // Reset USN validation state
  };

  const addStudent = () => {
    // Check if any of the fields are empty
    if (!usn || !email || !name || !program || !academicLevel || !term) {
      // Optionally show an error message or handle invalid states
      return;
    }

    if (!emailValid || !usnValid) {
      // Optionally show an error message or handle invalid states
      return;
    }

    const newStudent = { usn, name, email, program, academicLevel, term };
    setStudentList([...studentList, newStudent]);
    resetForm();
    setOpenAddModal(false);
    insertStudent(newStudent);
  };

  const editStudent = () => {
    const updatedStudent = { usn, name, email, program, academicLevel };
    const updatedList = [...studentList];
    updatedList[editingIndex] = updatedStudent;
    setStudentList(updatedList);
    resetForm();
    setEditingIndex(null);
    setOpenEditModal(false);
  };

  const openEditModalWithStudent = (index) => {
    const student = studentList[index];
    setUsn(student.usn);
    setEmail(student.email);
    setName(student.name);
    setProgram(student.program);
    setAcademicLevel(student.academicLevel);
    setEditingIndex(index);
    setOpenEditModal(true);
  };

  const deleteStudent = async () => {
    try {
      const student = studentList[deletingIndex];
      await Axios.delete(
        `${serverURL}/osc/api/deleteStudent/${student._id}`
      );
      const updatedList = studentList.filter((_, i) => i !== deletingIndex);
      setStudentList(updatedList);
      setOpenDeleteModal(false);
      setDeletingIndex(null);
    } catch (error) {
      console.error("Error deleting student", error);
    }
  };

  const confirmDelete = (index) => {
    setDeletingIndex(index);
    setOpenDeleteModal(true);
  };

  const insertStudent = (newStudent) => {
    Axios.post(`${serverURL}/osc/api/createStudent`, newStudent)
      .then(() => {
        alert("Student added successfully");
        fetchStudentList(); // Refetch the list after inserting a new student
      })
      .catch((error) => {
        console.error("There was an error adding the student!", error);
      });
  };

  const totalPages = Math.ceil(studentList.length / studentsPerPage);

  return (
    <>
      <div className="flex bg-maroon p-5 text-white justify-between">
        <h1 className="text-xl">Student List</h1>
        {
          data.department === "Academic" ?
          (
            <Button className="bg-redish" onClick={() => setOpenAddModal(true)}>
              Add Student
            </Button>
        ):(
          null
        )
        }
        <Modal
          show={openAddModal}
          size="md"
          popup
          onClose={() => setOpenAddModal(false)}
        >
          <Modal.Header />
          <Modal.Body>
            <h1 className="text-center font-semibold text-2xl w-full">
              Add Student
            </h1>
            <div className="flex item-center justify-center relative">
              <form className="flex w-96 flex-col gap-4 p-5">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="usn2" value="USN" className="text-black" />
                  </div>
                  <TextInput
                    id="usn2"
                    type="text"
                    placeholder="usn"
                    value={usn}
                    onChange={usnChange}
                    required
                    shadow
                  />
                  {!usnValid && (
                    <p className="text-red-500">Please enter a valid USN.</p>
                  )}
                  <div className="mb-2 block">
                    <Label
                      htmlFor="name2"
                      value="Name"
                      className="text-black"
                    />
                  </div>
                  <TextInput
                    id="name2"
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={nameChange}
                    required
                    shadow
                  />
                  <div className="mb-2 block">
                    <Label
                      htmlFor="email2"
                      value="Email"
                      className="text-black"
                    />
                  </div>
                  <TextInput
                    id="email2"
                    type="email"
                    placeholder="email"
                    onChange={emailChange}
                    value={email}
                    required
                    shadow
                  />
                  {!emailValid && (
                    <p className="text-red-500">
                      Please enter a valid email address.
                    </p>
                  )}
                  <div className="mb-2 block">
                    <Label
                      htmlFor="program2"
                      value="Program/Strand"
                      className="text-black"
                    />
                  </div>
                  <TextInput
                    id="program2"
                    type="text"
                    placeholder="program/strand"
                    onChange={programChange}
                    value={program}
                    required
                    shadow
                  />
                  <div className="mb-2 block">
                    <Label
                      htmlFor="academic2"
                      className="text-black"
                      value="Academic Level"
                    />
                  </div>
                  <select
                    id="academic2"
                    className="block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={academicLevel}
                    onChange={academicChange}
                    required
                  >
                    <option value="" disabled>
                      Select Academic Level
                    </option>
                    <option value="College">College</option>
                    <option value="SHS">SHS</option>
                  </select>
                  <div className="mb-2 block">
                    <Label
                      htmlFor="academic2"
                      className="text-black"
                      value="Term"
                    />
                  </div>
                  <select
                    id="academic2"
                    className="block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={term}
                    onChange={(e)=>{setTerm(e.target.value)}}
                    required
                  >
                    <option value="" disabled>
                      Select Term
                    </option>
                    <option value="Regular">Regular</option>
                    <option value="ASEAN">ASEAN</option>
                  </select>
                </div>
                <Button
                  onClick={addStudent}
                  className="bg-maroon mt-4"
                  disabled={!emailValid || !usnValid}
                >
                  Save
                </Button>
              </form>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          show={openEditModal}
          size="md"
          popup
          onClose={() => setOpenEditModal(false)}
        >
          <Modal.Header />
          <Modal.Body>
            <h1 className="text-center font-semibold text-2xl w-full">
              Edit Student
            </h1>
            <div className="flex item-center justify-center relative">
              <form className="flex w-96 flex-col gap-4 p-5">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="usn2" value="USN" className="text-black" />
                  </div>
                  <TextInput
                    id="usn2"
                    type="text"
                    placeholder="usn"
                    value={usn}
                    onChange={usnChange}
                    required
                    shadow
                  />
                  {!usnValid && (
                    <p className="text-red-500">
                      Please enter a valid USN (11 digits).
                    </p>
                  )}
                  <div className="mb-2 block">
                    <Label
                      htmlFor="name2"
                      value="Name"
                      className="text-black"
                    />
                  </div>
                  <TextInput
                    id="name2"
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={nameChange}
                    required
                    shadow
                  />
                  <div className="mb-2 block">
                    <Label
                      htmlFor="email2"
                      value="Email"
                      className="text-black"
                    />
                  </div>
                  <TextInput
                    id="email2"
                    type="email"
                    placeholder="email"
                    onChange={emailChange}
                    value={email}
                    required
                    shadow
                  />
                  <div className="mb-2 block">
                    <Label
                      htmlFor="program2"
                      value="Program/Strand"
                      className="text-black"
                    />
                  </div>
                  <TextInput
                    id="program2"
                    type="text"
                    placeholder="program/strand"
                    onChange={programChange}
                    value={program}
                    required
                    shadow
                  />
                  <div className="mb-2 block">
                    <Label
                      htmlFor="academic2"
                      className="text-black"
                      value="Academic Level"
                    />
                  </div>
                  <select
                    id="academic2"
                    className="block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={academicLevel}
                    onChange={academicChange}
                    required
                  >
                    <option value="" disabled>
                      Select Academic Level
                    </option>
                    <option value="college">College</option>
                    <option value="shs">SHS</option>
                  </select>
                </div>
                <Button onClick={editStudent} className="bg-maroon mt-4">
                  Save
                </Button>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>
      <div className="overflow-x-auto border-2 rounded-b-md">
        <Table>
          <Table.Head>
            <Table.HeadCell>USN</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Program/Strand</Table.HeadCell>
            <Table.HeadCell>Academic Level</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {studentList.map((student, index) => (
              <Table.Row
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-500 dark:text-white">
                  {student.usn}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-500 dark:text-white">
                  {student.name}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-500 dark:text-white">
                  {student.email}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-500 dark:text-white">
                  {student.program}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-500 dark:text-white">
                  {student.academicLevel}
                </Table.Cell>
                <Table.Cell className="flex">
                  {
                    data.department === "Academic" ? 
                    (
                      <>
                        <Button
                          onClick={() => openEditModalWithStudent(index)}
                          className="bg-blue-500 mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => confirmDelete(index)}
                          className="bg-red-500"
                        >
                          Delete
                        </Button>
                      </>
                    ):(
                      <span className="whitespace-nowrap text-gray-500 text-sm font-medium">
                          No permission
                      </span>
                    )
                  }
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <div className="flex justify-center mt-4">
        {currentPage > 1 && (
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="mr-2"
          >
            Previous Page
          </Button>
        )}
        {currentPage < totalPages && (
          <Button onClick={() => setCurrentPage(currentPage + 1)}>
            Next Page
          </Button>
        )}
      </div>
      <Modal
        show={openDeleteModal}
        size="md"
        popup
        onClose={() => setOpenDeleteModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <h1 className="text-center font-semibold text-2xl w-full">
            Confirm Delete
          </h1>
          <p className="text-center">
            Are you sure you want to delete this student?
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Button onClick={deleteStudent} className="bg-red-500">
              Yes, Delete
            </Button>
            <Button
              onClick={() => setOpenDeleteModal(false)}
              className="bg-gray-500"
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default HomeStudentList;
