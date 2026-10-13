package com.placement.portal.dto;

public class DepartmentPlacementDto {
    private String department;
    private long totalStudents;
    private long placedStudents;
    private double placementRate;
    private double averagePackage;

    public DepartmentPlacementDto() {}

    public DepartmentPlacementDto(String department, long totalStudents, long placedStudents, double placementRate, double averagePackage) {
        this.department = department;
        this.totalStudents = totalStudents;
        this.placedStudents = placedStudents;
        this.placementRate = placementRate;
        this.averagePackage = averagePackage;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getPlacedStudents() {
        return placedStudents;
    }

    public void setPlacedStudents(long placedStudents) {
        this.placedStudents = placedStudents;
    }

    public double getPlacementRate() {
        return placementRate;
    }

    public void setPlacementRate(double placementRate) {
        this.placementRate = placementRate;
    }

    public double getAveragePackage() {
        return averagePackage;
    }

    public void setAveragePackage(double averagePackage) {
        this.averagePackage = averagePackage;
    }
}
