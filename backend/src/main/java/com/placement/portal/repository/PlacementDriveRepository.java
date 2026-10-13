package com.placement.portal.repository;

import com.placement.portal.model.Company;
import com.placement.portal.model.PlacementDrive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long> {
    List<PlacementDrive> findByStatus(String status);
    List<PlacementDrive> findByCompany(Company company);
    List<PlacementDrive> findByOrderByDriveDateAsc();
}
