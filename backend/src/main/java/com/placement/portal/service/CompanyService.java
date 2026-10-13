package com.placement.portal.service;

import com.placement.portal.model.Company;
import com.placement.portal.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Optional<Company> getCompanyById(Long id) {
        return companyRepository.findById(id);
    }

    public Company createCompany(Company company) {
        return companyRepository.save(company);
    }

    public Company updateCompany(Long id, Company incoming) {
        return companyRepository.findById(id).map(existing -> {
            existing.setName(incoming.getName());
            existing.setIndustry(incoming.getIndustry());
            existing.setWebsite(incoming.getWebsite());
            existing.setLogoUrl(incoming.getLogoUrl());
            existing.setLocation(incoming.getLocation());
            existing.setDescription(incoming.getDescription());
            existing.setContactEmail(incoming.getContactEmail());
            existing.setContactPerson(incoming.getContactPerson());
            return companyRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
    }
}
