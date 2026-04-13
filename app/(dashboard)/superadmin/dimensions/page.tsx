"use client";

import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { DimensionCreateDialog } from "@/features/dimensions/components/dimension-create-dialog";
import { DimensionEditDialog } from "@/features/dimensions/components/dimension-edit-dialog";
import { useDimensionListPage } from "@/features/dimensions/hooks/use-dimension-list-page";

import { DimensionListScreen } from "./_components/dimension-list-screen";

export default function SuperAdminDimensionsPage() {
  const page = useDimensionListPage();

  return (
    <section className="space-y-6 px-4 py-5 sm:px-6 md:p-8">
      <div>
        <h1 className="font-playfair text-2xl font-semibold">Dimensions</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage the dimension codes used in questionnaire sections across each questionnaire type.
        </p>
      </div>

      <DimensionListScreen
        typeOptions={page.availableTypeOptions}
        typeFilter={page.typeFilter}
        statusFilter={page.statusFilter}
        searchValue={page.searchValue}
        currentPage={page.page}
        pageSize={page.pageSize}
        rows={page.rows}
        meta={page.meta}
        isLoading={page.isLoading}
        isError={page.isError}
        disableActions={page.isTogglePending}
        onTypeFilterChange={page.onTypeFilterChange}
        onStatusFilterChange={page.onStatusFilterChange}
        onSearchChange={page.onSearchChange}
        onClearFilters={page.onClearFilters}
        onCreateClick={() => page.setCreateOpen(true)}
        onPageSizeChange={page.onPageSizeChange}
        onEdit={(row) => page.setEditDimension(row)}
        onToggleStatus={(row) => page.setDimensionAction({ type: "toggle", dimension: row })}
        onRetry={page.onRetry}
      />

      <DimensionCreateDialog open={page.createOpen} onOpenChange={page.setCreateOpen} />

      <DimensionEditDialog
        open={page.editDimension !== null}
        onOpenChange={(open) => {
          if (!open) page.setEditDimension(null);
        }}
        dimension={page.editDimension}
      />

      {page.toggleDialogConfig && (
        <ConfirmationDialog
          open={page.dimensionAction !== null}
          onOpenChange={(open) => {
            if (!open && !page.isTogglePending) {
              page.setDimensionAction(null);
            }
          }}
          title={page.toggleDialogConfig.title}
          description={page.toggleDialogConfig.description}
          cancelLabel="Cancel"
          confirmLabel={page.toggleDialogConfig.confirmLabel}
          confirmVariant={page.toggleDialogConfig.confirmVariant}
          isPending={page.isTogglePending}
          onConfirm={() => {
            void page.onConfirmToggle();
          }}
        />
      )}
    </section>
  );
}
