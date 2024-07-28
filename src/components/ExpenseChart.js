import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    INR: '₹'
};

function ExpenseChart({ expenses, currency }) {
    const currencySymbol = currencySymbols[currency] || '$';
    const [viewMode, setViewMode] = useState('daily');
    const barChartRef = useRef();
    const pieChartRef = useRef();

    useEffect(() => {
        if (expenses.length === 0) return;

        if (viewMode === 'daily') {
            createDailyBarChart();
        } else {
            createMonthlyBarChart();
        }

        createCategoryPieChart();
    }, [expenses, viewMode]);

    const createDailyBarChart = () => {
        const svg = d3.select(barChartRef.current);
        svg.selectAll("*").remove();

        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 60, left: 40 };

        const x = d3.scaleBand()
            .domain(expenses.map(d => d.date))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(expenses, d => d.amount)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        svg.attr("viewBox", [0, 0, width, height]);

        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "bar-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", y(0))
            .attr("x2", 0)
            .attr("y2", y(d3.max(expenses, d => d.amount)));

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#4CAF50");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#2196F3");

        svg.append("g")
            .selectAll("rect")
            .data(expenses)
            .join("rect")
            .attr("x", d => x(d.date))
            .attr("y", d => y(d.amount))
            .attr("height", d => y(0) - y(d.amount))
            .attr("width", x.bandwidth())
            .attr("fill", "url(#bar-gradient)")
            .attr("rx", 5)
            .attr("ry", 5)
            .on("mouseover", function (event, d) {
                d3.select(this).attr("opacity", 0.8);
                svg.append("text")
                    .attr("class", "tooltip")
                    .attr("x", x(d.date) + x.bandwidth() / 2)
                    .attr("y", y(d.amount) - 5)
                    .attr("text-anchor", "middle")
                    .text(`${currencySymbol}${d.amount.toFixed(2)}`);
            })
            .on("mouseout", function () {
                d3.select(this).attr("opacity", 1);
                svg.select(".tooltip").remove();
            });

        svg.append("g")
            .call(g => g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x)
                    .tickValues(x.domain().filter((d, i) => !(i % 3)))
                )
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)"));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickFormat(d => `${currencySymbol}${d}`)
            );

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 5)
            .attr("text-anchor", "middle")
            .text("Date");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text(`Amount (${currencySymbol})`);
    };

    const createMonthlyBarChart = () => {
        const svg = d3.select(barChartRef.current);
        svg.selectAll("*").remove();

        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        const monthlyData = d3.rollup(
            expenses,
            v => d3.sum(v, d => d.amount),
            d => d.date.slice(0, 7)
        );

        const x = d3.scaleBand()
            .domain(Array.from(monthlyData.keys()))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(monthlyData.values())])
            .nice()
            .range([height - margin.bottom, margin.top]);

        svg.attr("viewBox", [0, 0, width, height]);

        svg.append("g")
            .attr("fill", "steelblue")
            .selectAll("rect")
            .data(monthlyData)
            .join("rect")
            .attr("x", ([month]) => x(month))
            .attr("y", ([, amount]) => y(amount))
            .attr("height", ([, amount]) => y(0) - y(amount))
            .attr("width", x.bandwidth());

        svg.append("g")
            .call(g => g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x).tickSizeOuter(0)));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 5)
            .attr("text-anchor", "middle")
            .text("Month");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text("Total Amount ($)");
    };

    const createCategoryPieChart = () => {
        const svg = d3.select(pieChartRef.current);
        svg.selectAll("*").remove();

        const width = 300;
        const height = 300;
        const radius = Math.min(width, height) / 2;

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie()
            .value(d => d[1])
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const categoryData = Array.from(d3.rollup(
            expenses,
            v => d3.sum(v, d => d.amount),
            d => d.category
        ));

        svg.attr("viewBox", [0, 0, width, height]);

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const arcs = g.selectAll("arc")
            .data(pie(categoryData))
            .enter().append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data[0]))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .on("mouseover", function (event, d) {
                const [x, y] = arc.centroid(d);
                const total = d3.sum(categoryData, d => d[1]);
                const percent = Math.round(1000 * d.data[1] / total) / 10;

                // 3D effect
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("d", d3.arc()
                        .innerRadius(0)
                        .outerRadius(radius * 1.1)
                    );

                // Hover card
                const card = svg.append("g")
                    .attr("class", "hover-card")
                    .attr("transform", `translate(${width / 2 + x},${height / 2 + y})`);

                card.append("rect")
                    .attr("x", 10)
                    .attr("y", -30)
                    .attr("width", 120)
                    .attr("height", 60)
                    .attr("fill", "white")
                    .attr("stroke", "#ccc")
                    .attr("rx", 5)
                    .attr("ry", 5);

                card.append("text")
                    .attr("x", 15)
                    .attr("y", -15)
                    .text(d.data[0])
                    .attr("font-weight", "bold");

                card.append("text")
                    .attr("x", 15)
                    .attr("y", 5)
                    .text(`${currencySymbol}${d.data[1].toFixed(2)}`);

                card.append("text")
                    .attr("x", 15)
                    .attr("y", 25)
                    .text(`${percent}%`);
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("d", arc);
                svg.select(".hover-card").remove();
            });

        // Legend
        const legendG = svg.append("g")
            .attr("transform", `translate(${width - 100}, ${height - 20})`);

        categoryData.forEach((category, index) => {
            const legendRow = legendG.append("g")
                .attr("transform", `translate(0, ${-index * 20})`);

            legendRow.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", color(category[0]));

            legendRow.append("text")
                .attr("x", 15)
                .attr("y", 10)
                .text(category[0])
                .style("font-size", "12px")
                .attr("text-anchor", "start")
                .style("alignment-baseline", "middle");
        });
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Expense Charts</Typography>
            <Box sx={{ mb: 2 }}>
                <Button
                    variant={viewMode === 'daily' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('daily')}
                    sx={{ mr: 1 }}
                >
                    Daily View
                </Button>
                <Button
                    variant={viewMode === 'monthly' ? 'contained' : 'outlined'}
                    onClick={() => setViewMode('monthly')}
                >
                    Monthly View
                </Button>
            </Box>
            <Box sx={{ mb: 3 }}>
                <svg ref={barChartRef} style={{ width: '100%', height: 'auto', minHeight: '300px' }}></svg>
            </Box>
            <Typography variant="h6" gutterBottom>Expenses by Category</Typography>
            <svg ref={pieChartRef} style={{ width: '400px', height: 'auto' }}></svg>
        </Box>
    );
}

export default ExpenseChart;