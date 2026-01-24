import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button, ButtonGroup, Card, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../components/shared/Layout/Layout";
import {
  syncAllStudents,
  syncRecentStudents,
  getSyncStatus,
} from "../../actions/Student.action";
import { syncGrades } from "../../actions/Grade.action";
import { TENANT_LIST, DEFAULT_TENANT, getTenantLabel } from "../../constants/Tenant";

const ManagementPage = ({
  syncStatus,
  syncAllStudents,
  syncRecentStudents,
  getSyncStatus,
  syncGrades,
  selectedTenant,
}) => {
  const [loading, setLoading] = useState({
    syncAll: false,
    syncRecent: false,
    syncGrades: false,
  });

  // Fetch sync status on mount and when tenant changes
  useEffect(() => {
    getSyncStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSyncStatus(selectedTenant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTenant]);

  const handleSyncAll = async () => {
    setLoading({ ...loading, syncAll: true });
    try {
      await syncAllStudents(selectedTenant);
    } finally {
      setLoading({ ...loading, syncAll: false });
      // Refresh sync status after sync
      getSyncStatus(selectedTenant);
    }
  };

  const handleSyncRecent = async () => {
    setLoading({ ...loading, syncRecent: true });
    try {
      await syncRecentStudents(selectedTenant);
    } finally {
      setLoading({ ...loading, syncRecent: false });
      // Refresh sync status after sync
      getSyncStatus(selectedTenant);
    }
  };

  const handleSyncGrades = async () => {
    setLoading({ ...loading, syncGrades: true });
    try {
      await syncGrades(selectedTenant);
    } finally {
      setLoading({ ...loading, syncGrades: false });
    }
  };

  // Get last sync time for selected tenant
  const tenantStatus = syncStatus?.[selectedTenant] || { lastSyncTime: null };
  const lastSyncTime = tenantStatus.lastSyncTime;

  // Format last sync time
  const formatLastSyncTime = (timeString) => {
    if (!timeString) return "Never synced";
    try {
      const date = new Date(timeString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Layout title="Management">
      <Container>
        <Card bg="white" text="dark" className="shadow mb-4">
          <Card.Header>
            <h5 className="mb-0">Student Data Synchronization</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={12} className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Last Sync Time</h6>
                    <p className="mb-0 text-muted">
                      {formatLastSyncTime(lastSyncTime)}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={12} className="mb-3">
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="w-100"
                  onClick={handleSyncRecent}
                  disabled={loading.syncAll || loading.syncRecent}
                >
                  {loading.syncRecent ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Syncing...
                    </>
                  ) : (
                    "Sync Recent (Last 48h)"
                  )}
                </Button>
                <p className="text-muted small mt-2 mb-0">
                  Synchronize students updated in the last 48 hours
                </p>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col>
                <div className="alert alert-info mb-0">
                  <strong>Note:</strong> The CRON job automatically syncs students
                  updated in the last 48 hours every minute (for development). Use
                  "Sync Recent (Last 48h)" to manually trigger a sync for recent updates.
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card bg="white" text="dark" className="shadow mb-4">
          <Card.Header>
            <h5 className="mb-0">Grade Data Synchronization</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={12} className="mb-4">
                <p className="text-muted mb-0">
                  Synchronize grades, shifts, and batches from {getTenantLabel(selectedTenant)} site
                </p>
              </Col>
            </Row>

            <Row>
              <Col md={12} className="mb-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100"
                  onClick={handleSyncGrades}
                  disabled={loading.syncGrades || loading.syncAll || loading.syncRecent}
                >
                  {loading.syncGrades ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Syncing...
                    </>
                  ) : (
                    "Sync Grades, Shifts & Batches"
                  )}
                </Button>
                <p className="text-muted small mt-2 mb-0">
                  Synchronize all grade, shift, and batch data from {getTenantLabel(selectedTenant)} site
                </p>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col>
                <div className="alert alert-info mb-0">
                  <strong>Note:</strong> The CRON job automatically syncs grades, shifts, and batches
                  every hour. Use this button to manually trigger a sync.
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card bg="danger" text="white" className="shadow mb-4">
          <Card.Header>
            <h5 className="mb-0">Developer Management Commands</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={12} className="mb-3">
                <div className="alert alert-warning mb-4" role="alert">
                  <strong>⚠️ WARNING:</strong> This section is only for developers. Please do not click on the button if you are not the developer.
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12} className="mb-3">
                <Button
                  variant="light"
                  size="lg"
                  className="w-100"
                  onClick={handleSyncAll}
                  disabled={loading.syncAll || loading.syncRecent}
                >
                  {loading.syncAll ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Syncing...
                    </>
                  ) : (
                    "Sync All Students"
                  )}
                </Button>
                <p className="text-light small mt-2 mb-0">
                  Synchronize all student data from {getTenantLabel(selectedTenant)} site
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  syncStatus: state.student?.syncStatus || {
    primary: { lastSyncTime: null },
    coaching: { lastSyncTime: null },
  },
  selectedTenant: state.tenant?.selectedTenant,
});

export default connect(mapStateToProps, {
  syncAllStudents,
  syncRecentStudents,
  getSyncStatus,
  syncGrades,
})(ManagementPage);


