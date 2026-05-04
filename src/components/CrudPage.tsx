import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTableShell } from "@/components/DataTableShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { StatusBadge, BloodChip } from "@/components/StatusBadge";
import { toast } from "sonner";

export interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "textarea";
  options?: string[] | { label: string; value: any }[];
  render?: (value: any, row: any) => React.ReactNode;
  hideInTable?: boolean;
  hideInForm?: boolean;
  required?: boolean;
  default?: any;
}

interface Props {
  title: string;
  subtitle?: string;
  table: string;
  pk: string;
  fields: FieldDef[];
  searchKeys?: string[];
  defaultRow?: Record<string, any>;
  canDelete?: boolean;
}

export function CrudPage({ title, subtitle, table, pk, fields, searchKeys = [], defaultRow = {}, canDelete = true }: Props) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, any>>(defaultRow);
  const [editingId, setEditingId] = useState<any>(null);

  const { data = [], isLoading } = useQuery<any[]>({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from(table).select("*").limit(1000);
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async (row: any) => {
      const { error } = await (supabase as any).from(table).insert(row);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Record added"); qc.invalidateQueries({ queryKey: [table] }); setOpen(false); setForm(defaultRow); },
    onError: (e: any) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, row }: { id: any; row: any }) => {
      const payload = { ...row };
      delete payload[pk];
      const { error } = await (supabase as any).from(table).update(payload).eq(pk, id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Record updated"); qc.invalidateQueries({ queryKey: [table] }); setOpen(false); setEditingId(null); setForm(defaultRow); },
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: any) => {
      const { error } = await (supabase as any).from(table).delete().eq(pk, id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: [table] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    if (!search) return data;
    const s = search.toLowerCase();
    return data.filter(r => searchKeys.some(k => String(r[k] ?? "").toLowerCase().includes(s)));
  }, [data, search, searchKeys]);

  const tableFields = fields.filter(f => !f.hideInTable);
  const formFields = fields.filter(f => !f.hideInForm);

  const openEdit = (row: any) => {
    setEditingId(row[pk]);
    setForm(row);
    setOpen(true);
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) { setEditingId(null); setForm(defaultRow); }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingId(null); setForm(defaultRow); }} className="gradient-primary text-primary-foreground shadow-elegant">
                <Plus className="h-4 w-4 mr-1" /> Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>{editingId ? "Edit" : "Add"} {title}</DialogTitle></DialogHeader>
              <div className="space-y-3 py-2">
                {formFields.map(f => (
                  <div key={f.key}>
                    <Label className="text-xs">{f.label}{f.required && <span className="text-destructive">*</span>}</Label>
                    {f.type === "select" ? (
                      <Select value={form[f.key] != null ? String(form[f.key]) : ""} onValueChange={v => setForm({ ...form, [f.key]: isNaN(Number(v)) ? v : Number(v) })}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                          {(f.options as any[] ?? []).map((o: any) => {
                            const val = typeof o === "string" ? o : o.value;
                            const label = typeof o === "string" ? o : o.label;
                            return <SelectItem key={String(val)} value={String(val)}>{label}</SelectItem>;
                          })}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                        value={form[f.key] ?? ""}
                        onChange={e => setForm({ ...form, [f.key]: f.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
                <Button
                  onClick={() => editingId ? update.mutate({ id: editingId, row: form }) : create.mutate(form)}
                  disabled={create.isPending || update.isPending}
                  className="gradient-primary text-primary-foreground"
                >
                  {(create.isPending || update.isPending) ? "Saving..." : editingId ? "Update" : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {searchKeys.length > 0 && (
        <Card className="p-3 shadow-card">
          <div className="relative max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder={`Search by ${searchKeys.join(", ")}...`} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </Card>
      )}

      <DataTableShell title={`${filtered.length} record${filtered.length === 1 ? "" : "s"}`}>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {tableFields.map(f => <th key={f.key} className="text-left px-6 py-3 font-semibold">{f.label}</th>)}
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={tableFields.length+1} className="px-6 py-12 text-center text-muted-foreground">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={tableFields.length+1} className="px-6 py-12 text-center text-muted-foreground">No records yet</td></tr>
            ) : filtered.map(row => (
              <tr key={row[pk]} className="border-t border-border hover:bg-accent/40 transition-smooth">
                {tableFields.map(f => (
                  <td key={f.key} className="px-6 py-3.5">{f.render ? f.render(row[f.key], row) : (row[f.key] ?? "—")}</td>
                ))}
                <td className="px-6 py-3.5 text-right whitespace-nowrap">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(row)} title="Edit">
                    <Pencil className="h-4 w-4 text-primary" />
                  </Button>
                  {canDelete && (
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete this record?")) remove.mutate(row[pk]); }} title="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTableShell>
    </div>
  );
}

export { StatusBadge, BloodChip };