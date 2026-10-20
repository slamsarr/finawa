package sn.finawa.service;

import sn.finawa.dto.MatchingResponse;

import java.util.List;

public interface MatchingService {
    List<MatchingResponse> runMatching(Long dossierId);
    List<MatchingResponse> getMatchingForDossier(Long dossierId);
    List<MatchingResponse> getMatchingForPartner(Long partnerId);
    MatchingResponse updateStatus(Long matchingId, String status);
    void delete(Long matchingId);
    void clearForDossier(Long dossierId);
}
