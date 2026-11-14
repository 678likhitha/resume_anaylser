
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Typography,
  Alert,
  IconButton,
  LinearProgress
} from "@mui/material";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import "./ResumeAnalyzer.css";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }

    setFile(selectedFile);
    setAnalysis("");
    setError("");
  };

  const handleRemoveFile = () => {
    setFile(null);
    setAnalysis("");
    setError("");

    const input = document.getElementById("resume-upload");
    if (input) input.value = "";
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select your resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");
      setAnalysis("");

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze-resume",
        formData
      );

      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error("Resume analysis error:", error);

      setError(
        error.response?.data?.detail ||
        "Unable to analyze your resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-page">
      <Container maxWidth="md">

        {/* Header */}
        <Box className="hero-section">

          <Chip
            icon={<AutoAwesomeIcon />}
            label="AI POWERED CAREER ASSISTANT"
            className="hero-chip"
          />

          <Typography className="hero-title">
            AI Resume <span>Analyzer</span>
          </Typography>

          <Typography className="hero-subtitle">
            Make your next career move with confidence.
            Get intelligent resume feedback and actionable
            recommendations powered by AI.
          </Typography>

        </Box>

        {/* Upload Card */}
        <Card className="upload-card">
          <CardContent className="upload-content">

            <Box className="section-heading">
              <Box className="heading-icon">
                <CloudUploadOutlinedIcon />
              </Box>

              <Box>
                <Typography className="section-title">
                  Upload your resume
                </Typography>

                <Typography className="section-description">
                  Upload your PDF and let AI review your profile.
                </Typography>
              </Box>
            </Box>

            {/* Upload Area */}
            {!file ? (
              <Box className="upload-zone">

                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  hidden
                  onChange={handleFileChange}
                />

                <Box className="upload-icon">
                  <CloudUploadOutlinedIcon />
                </Box>

                <Typography className="upload-main-text">
                  Drop your resume here
                </Typography>

                <Typography className="upload-sub-text">
                  or browse files from your computer
                </Typography>

                <Button
                  component="label"
                  htmlFor="resume-upload"
                  variant="contained"
                  startIcon={<CloudUploadOutlinedIcon />}
                  className="browse-button"
                >
                  Browse Resume
                </Button>

                <Typography className="file-hint">
                  Supported format: PDF
                </Typography>

              </Box>
            ) : (
              <Box className="file-card">

                <Box className="file-left">
                  <Box className="pdf-icon">
                    <PictureAsPdfIcon />
                  </Box>

                  <Box className="file-info">
                    <Typography className="file-name">
                      {file.name}
                    </Typography>

                    <Typography className="file-size">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                      {" "}• PDF Document
                    </Typography>
                  </Box>
                </Box>

                <Box className="file-right">
                  <Chip
                    icon={<CheckCircleOutlinedIcon />}
                    label="Ready"
                    className="ready-chip"
                  />

                  <IconButton
                    onClick={handleRemoveFile}
                    disabled={loading}
                    className="remove-button"
                    aria-label="Remove resume"
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                </Box>

              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {/* Analyze Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleAnalyze}
              disabled={!file || loading}
              startIcon={
                loading ? null : <AutoAwesomeIcon />
              }
              className="analyze-button"
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={20}
                    sx={{ color: "#fff", mr: 1 }}
                  />
                  Analyzing Resume...
                </>
              ) : (
                "Analyze My Resume"
              )}
            </Button>

            {loading && (
              <Box className="loading-section">
                <LinearProgress className="loading-bar" />

                <Typography className="loading-text">
                  AI is reviewing your experience and skills...
                </Typography>
              </Box>
            )}

          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <Card className="result-card">

            <CardContent className="result-content">

              <Box className="result-header">

                <Box className="result-heading-left">
                  <Box className="result-icon">
                    <AnalyticsOutlinedIcon />
                  </Box>

                  <Box>
                    <Typography className="result-title">
                      Resume Analysis
                    </Typography>

                    <Typography className="result-subtitle">
                      Your AI-powered resume evaluation
                    </Typography>
                  </Box>
                </Box>

                <Chip
                  icon={<CheckCircleOutlinedIcon />}
                  label="Analysis Complete"
                  className="complete-chip"
                />

              </Box>

              <Box className="analysis-body">
                <ReactMarkdown>
                  {analysis}
                </ReactMarkdown>
              </Box>

              <Button
                variant="outlined"
                onClick={() => {
                  setAnalysis("");
                  setError("");
                }}
                className="reanalyze-button"
              >
                Analyze Another Resume
              </Button>

            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <Typography className="footer-text">
          Powered by AI • Built to help you grow your career
        </Typography>

      </Container>
    </div>
  );
}
