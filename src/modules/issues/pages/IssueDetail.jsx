import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";

function IssueDetail({ issues, setIssues }) {
  const { id } = useParams();
  const issue = issues.find((item) => String(item.id) === id);

  const [votedIssues, setVotedIssues] = useState([]);

  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem("votedIssues")) || [];
    setVotedIssues(storedVotes);
  }, []);

  const handleUpvote = () => {
    if (votedIssues.includes(issue.id)) return;

    setIssues((prevIssues) =>
      prevIssues.map((it) =>
        it.id === issue.id ? { ...it, upvotes: it.upvotes + 1 } : it
      )
    );

    const updatedVotes = [...votedIssues, issue.id];
    setVotedIssues(updatedVotes);
    localStorage.setItem("votedIssues", JSON.stringify(updatedVotes));
  };

  if (!issue) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h5" color="error">
                ❌ Issue not found
              </Typography>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
            <CardMedia
              component="img"
              height="300"
              image={issue.image}
              alt={issue.title}
            />
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {issue.title}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                {issue.description}
              </Typography>

              <Row className="mt-3">
                <Col sm={6}>
                  <Typography variant="subtitle1">
                    📍 <b>Location:</b> {issue.location}
                  </Typography>
                </Col>
                <Col sm={6}>
                  <Typography variant="subtitle1">
                    🏷 <b>Category:</b>{" "}
                    <Chip label={issue.category} color="primary" />
                  </Typography>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <Typography variant="subtitle1">
                    ✅ <b>Status:</b>{" "}
                    <Chip
                      label={issue.status}
                      color={
                        issue.status === "Open"
                          ? "error"
                          : issue.status === "In Progress"
                          ? "warning"
                          : "success"
                      }
                    />
                  </Typography>
                </Col>
              </Row>

              {/* Upvote button */}
              <Row className="mt-4">
                <Col>
                  <Button
                    variant="outlined"
                    onClick={handleUpvote}
                    disabled={votedIssues.includes(issue.id)}>
                    👍 {votedIssues.includes(issue.id) ? "Voted" : "Upvote"} (
                    {issue.upvotes})
                  </Button>
                </Col>
              </Row>
            </CardContent>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default IssueDetail;
