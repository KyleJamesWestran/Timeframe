import React from 'react';
import {Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: 'Helvetica',
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 16,
        padding: 10,
        
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#222'
    },
    section: {
        margin: 10
    },
    table: {
        display: 'table',
        width: '100%', // Full width of page content area
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#888',
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        flexDirection: 'row'
    },
    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#f3f4f6'
    },
    tableCol: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#888',
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 2,
        minWidth: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerCol: {
        fontWeight: 'bold',
        color: '#111'
    },
    periodCol: {
        backgroundColor: '#f9fafb',
        fontWeight: '600',
        color: '#111',
        flex: 0.5, // make period column smaller (half the width of other columns)
        minWidth: 30
    },
    tableCellText: {
        textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: 0.7,
        color: '#333',
        padding: 3
    },
    tableCellTextBold: {
        textAlign: 'center',
        lineHeight: 1.2,
        color: '#333',
        fontWeight: 900
    },
    oddRow: {
        backgroundColor: '#fbfbfb'
    },
    evenRow: {
        backgroundColor: '#fefefe'
    }
});

const TimetableTable = ({name, timetable, days, periods, type}) => (
    <View style={styles.section} wrap={false}>
        <Text style={styles.title}>{name} Timetable</Text>
        <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.tableHeaderRow}>
                <View style={[styles.tableCol, styles.headerCol, styles.periodCol]}>
                    <Text style={styles.tableCellText}>Period</Text>
                </View>
                {days.map((day) => (
                    <View key={day} style={[styles.tableCol, styles.headerCol]}>
                        <Text style={styles.tableCellText}>{day}</Text>
                    </View>
                ))}
            </View>

            {/* Data Rows */}
            {periods.map((period, index) => (
                <View
                    key={period}
                    style={[
                    styles.tableRow, index % 2 === 0
                        ? styles.evenRow
                        : styles.oddRow
                ]}>
                    <View style={[styles.tableCol, styles.periodCol]}>
                        <Text style={styles.tableCellText}>{period}</Text>
                    </View>
                    {days.map((day) => {
                        const lesson = (timetable[day] || []).find((l) => l.period === period);
                        return (
                            <View key={day} style={styles.tableCol}>
                                {lesson
                                    ? (type === "teacher"
                                        ? (
                                            <Text style={styles.tableCellText}>
                                                <Text
                                                    style={{
                                                    fontWeight: "bold"
                                                }}>{lesson.class}</Text>
                                                {"\n"}
                                                <Text>{lesson.subject}</Text>
                                            </Text>
                                        )
                                        : (
                                            <Text style={styles.tableCellText}>
                                                <Text
                                                    style={{
                                                    fontWeight: "bold"
                                                }}>{lesson.teacher}</Text>
                                                {"\n"}
                                                <Text>{lesson.subject}</Text>
                                            </Text>
                                        ))
                                    : (
                                        <Text style={styles.tableCellText}></Text>
                                    )}
                            </View>
                        );
                    })}
                </View>
            ))}
        </View>
    </View>
);

const TimetablePDF = ({data}) => {
    const days = data
        ?.days || [];

    // Estimate per-row height (in PDF points)
    const rowHeight = 40;
    const baseHeight = 100; // for title and top padding

    const periods = Array.from({
        length: data
            ?.periods_per_day || 0
    }, (_, i) => i + 1);

    // Calculate dynamic page height
    const pageHeight = baseHeight + periods.length * rowHeight;

    // A4 width in landscape: 842pt
    const pageSize = {
        width: 842,
        height: pageHeight
    };

    const teacherPages = Object
        .entries(data
        ?.teacher_timetables || {})
        .map(([name, timetable]) => (
            <Page key={`teacher-${name}`} size={pageSize} style={styles.page}>
                <TimetableTable
                    name={name}
                    timetable={timetable}
                    days={days}
                    periods={periods}
                    type="teacher"/>
            </Page>
        ));

    const classPages = Object
        .entries(data
        ?.class_timetables || {})
        .map(([name, timetable]) => (
            <Page key={`class-${name}`} size={pageSize} style={styles.page}>
                <TimetableTable
                    name={name}
                    timetable={timetable}
                    days={days}
                    periods={periods}
                    type="class"/>
            </Page>
        ));

    return <Document>{teacherPages}{classPages}</Document>;
};

export default TimetablePDF;
