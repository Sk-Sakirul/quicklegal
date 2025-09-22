import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCase, resetCaseState } from "../../features/caseSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CaseForm = () => {
  const dispatch = useDispatch();
  const { createCaseLoading, createCaseError } = useSelector(
    (state) => state.case
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Clear success message or errors on component unmount
    return () => dispatch(resetCaseState());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg("");

    const formData = {
      title,
      description,
      tags: tags.split(",").map((t) => t.trim()),
    };

    dispatch(createCase(formData))
      .unwrap()
      .then(() => {
         navigate("/profile/my-cases");
        setSuccessMsg("Case registered successfully!");
        setTitle("");
        setDescription("");
        setTags("");
      })
      .catch((error) => {
        // Error handled via slice
        toast(error.message);
      });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">
        Register a Case
      </h2>

      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
      {createCaseError && (
        <p className="text-red-600 mb-4">{createCaseError}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows="5"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Tags{" "}
            <span className="text-gray-400 text-sm">(comma separated)</span>
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
          type="submit"
          disabled={createCaseLoading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          {createCaseLoading ? "Submitting..." : "Register Case"}
        </button>
      </form>
    </div>
  );
};

export default CaseForm;
