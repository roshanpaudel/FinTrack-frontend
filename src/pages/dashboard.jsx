import React, { useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTransactions } from "../context/TransactionsContext";

const chartColors = [
  "#FF9F1C",
  "#2EC4B6",
  "#E71D36",
  "#011627",
  "#6C5CE7",
  "#00B894",
];

const getCoordinatesForPercent = (percent) => {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
};

function Dashboard() {
  const {
    transactions,
    isLoading,
    errorMessage,
    hasLoaded,
    loadTransactions,
  } = useTransactions();

  useEffect(() => {
    if (!hasLoaded) {
      loadTransactions();
    }
  }, [hasLoaded, loadTransactions]);

  const summary = useMemo(() => {
    const totals = transactions.reduce(
      (acc, item) => {
        if (item.type === "credit") {
          acc.credit += item.amount || 0;
        } else {
          acc.debit += item.amount || 0;
        }
        return acc;
      },
      { credit: 0, debit: 0 }
    );
    return {
      credit: totals.credit,
      debit: totals.debit,
      balance: totals.credit - totals.debit,
    };
  }, [transactions]);

  const categoryTotals = useMemo(() => {
    const totals = transactions.reduce((acc, item) => {
      const label = item.category || "General";
      acc[label] = (acc[label] || 0) + Number(item.amount || 0);
      return acc;
    }, {});
    return Object.entries(totals)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalByCategory = categoryTotals.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const maxCategoryValue = categoryTotals.reduce(
    (maxValue, item) => Math.max(maxValue, item.value),
    0
  );

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(value || 0));

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">Dashboard</h1>
          <p className="text-muted mb-0">
            Overview of spending by category.
          </p>
        </Col>
      </Row>
      <Row className="g-4">
        <Col lg={12}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-wrap gap-3">
              <div>
                <div className="text-muted">Total Credit</div>
                <div className="fw-bold">{formatCurrency(summary.credit)}</div>
              </div>
              <div>
                <div className="text-muted">Total Debit</div>
                <div className="fw-bold">{formatCurrency(summary.debit)}</div>
              </div>
              <div>
                <div className="text-muted">Balance</div>
                <div className="fw-bold">{formatCurrency(summary.balance)}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="mb-3">Category Split</Card.Title>
              {isLoading ? (
                <div className="text-muted">Loading charts...</div>
              ) : totalByCategory ? (
                <div className="d-flex flex-wrap gap-4 align-items-center">
                  <svg
                    viewBox="-1 -1 2 2"
                    style={{ width: 220, height: 220 }}
                  >
                    {(() => {
                      let cumulativePercent = 0;
                      return categoryTotals.map((slice, index) => {
                        const slicePercent = slice.value / totalByCategory;
                        const [startX, startY] =
                          getCoordinatesForPercent(cumulativePercent);
                        cumulativePercent += slicePercent;
                        const [endX, endY] =
                          getCoordinatesForPercent(cumulativePercent);
                        const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
                        const pathData = [
                          `M ${startX} ${startY}`,
                          `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                          "L 0 0",
                        ].join(" ");
                        const color = chartColors[index % chartColors.length];
                        return <path key={slice.label} d={pathData} fill={color} />;
                      });
                    })()}
                  </svg>
                  <div className="d-flex flex-column gap-2">
                    {categoryTotals.map((item, index) => (
                      <div key={item.label} className="d-flex align-items-center">
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 4,
                            backgroundColor:
                              chartColors[index % chartColors.length],
                            display: "inline-block",
                            marginRight: 8,
                          }}
                        />
                        <span className="me-2">{item.label}</span>
                        <span className="text-muted">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-muted">No data to visualize yet.</div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title className="mb-3">Category Totals</Card.Title>
              {isLoading ? (
                <div className="text-muted">Loading charts...</div>
              ) : categoryTotals.length ? (
                <div className="d-flex flex-column gap-3">
                  {categoryTotals.map((item, index) => {
                    const widthPercent = maxCategoryValue
                      ? Math.round((item.value / maxCategoryValue) * 100)
                      : 0;
                    return (
                      <div key={item.label}>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-semibold">{item.label}</span>
                          <span className="text-muted">
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                        <div
                          style={{
                            height: 10,
                            backgroundColor: "#F1F3F5",
                            borderRadius: 999,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${widthPercent}%`,
                              backgroundColor:
                                chartColors[index % chartColors.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-muted">No data to visualize yet.</div>
              )}
            </Card.Body>
          </Card>
        </Col>
        {errorMessage ? (
          <Col lg={12}>
            <div className="text-danger">{errorMessage}</div>
          </Col>
        ) : null}
      </Row>
    </Container>
  );
}

export default Dashboard;
