package sn.finawa.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface CRUDService<D> {
        D create(D dto);

        D update(D dto);

        D read(Long id);

        Page<D> readAll(Map<String, String> searchParams, Pageable pageable);

        void delete(Long id);
}
