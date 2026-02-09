"use client";

import { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Search, ChevronLeft, CheckCircle, XCircle, Pencil, Power } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DUMMY_DATA = [
    { id: 1, orgName: "Acme Corporation", planName: "Silver Plan", details: "Price Per Customer: 100", total: "7,200 units", status: "Enabled" },
    { id: 2, orgName: "Beta Limited", planName: "Growth Plan", details: "80 / 2000 units", total: "2,000 units", status: "Disabled" },
    { id: 3, orgName: "Gamma Inc.", planName: "Basic Plan", details: "50 / 10,000 units", total: "10,000 units", status: "Disabled" },
    { id: 4, orgName: "Delta Solutions", planName: "Growth Plan", details: "80 / 2000 units", total: "2,000 units", status: "Disabled" },
    { id: 5, orgName: "Omega Pvt Ltd", planName: "Silver Plan", details: "100 / 3000 units", total: "3,000 units", status: "Enabled" },
    { id: 6, orgName: "Tech Nova", planName: "Basic Plan", details: "50 / 1000 units", total: "1,000 units", status: "Disabled" },
    { id: 7, orgName: "Tech Nova", planName: "Basic Plan", details: "50 / 1000 units", total: "1,000 units", status: "Disabled" },
    { id: 8, orgName: "Tech Nova", planName: "Basic Plan", details: "50 / 1000 units", total: "1,000 units", status: "Disabled" },
    { id: 9, orgName: "Tech Nova", planName: "Basic Plan", details: "50 / 1000 units", total: "1,000 units", status: "Disabled" },
    { id: 10, orgName: "Tech Nova", planName: "Basic Plan", details: "50 / 1000 units", total: "1,000 units", status: "Disabled" },
];

interface ActiveSubscriptionsProps {
    onUpdateClick?: () => void;
}

export function ActiveSubscriptions({ onUpdateClick }: ActiveSubscriptionsProps) {
    const [data, setData] = useState(DUMMY_DATA);

    const [search, setSearch] = useState("");
    const [planFilter, setPlanFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [pageInput, setPageInput] = useState("1");

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<any>(null);

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchesSearch =
                item.orgName.toLowerCase().includes(search.toLowerCase()) ||
                item.planName.toLowerCase().includes(search.toLowerCase());

            const matchesPlan =
                planFilter === "all" ||
                item.planName.toLowerCase().includes(planFilter);

            return matchesSearch && matchesPlan;
        });
    }, [data, search, planFilter]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage]);

    const getSlidingPages = () => {
        let start = currentPage;
        if (start + 2 > totalPages) {
            start = Math.max(totalPages - 2, 1);
        }
        return Array.from({ length: Math.min(3, totalPages - start + 1) }, (_, i) => start + i);
    };

    const handlePageChange = (page: number) => {
        const validPage = Math.min(Math.max(page, 1), totalPages);
        setCurrentPage(validPage);
        setPageInput(String(validPage));
    };

    const toggleStatus = () => {
        setData((prev) =>
            prev.map((item) =>
                item.id === selectedOrg.id
                    ? { ...item, status: item.status === "Enabled" ? "Disabled" : "Enabled" }
                    : item
            )
        );
        setShowConfirm(false);
        setSelectedOrg(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Subscribed Organizations</h3>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-8 w-[220px]"
                            placeholder="Search organization or plan..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                handlePageChange(1);
                            }}
                        />
                    </div>

                    <Select
                        value={planFilter}
                        onValueChange={(value) => {
                            setPlanFilter(value);
                            handlePageChange(1);
                        }}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="All Plans" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Plans</SelectItem>
                            <SelectItem value="silver">Silver</SelectItem>
                            <SelectItem value="growth">Growth</SelectItem>
                            <SelectItem value="basic">Basic</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="border rounded-lg shadow-sm bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Organization</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <span className="font-medium">{item.orgName}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>{item.planName}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {item.details}
                                    </TableCell>
                                    <TableCell>{item.total}</TableCell>

                                    {/* ✅ UPDATED STATUS UI (ICON + COLOR) */}
                                    <TableCell>
                                        <span
                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium w-fit
                                            ${item.status === "Enabled"
                                                    ? "bg-green-50 text-green-600"
                                                    : "bg-red-50 text-red-600"
                                                }`}
                                        >
                                            {item.status === "Enabled" ? (
                                                <CheckCircle className="w-4 h-4" />
                                            ) : (
                                                <XCircle className="w-4 h-4" />
                                            )}
                                            {/* {item.status === "Enabled" ? "Active" : "Inactive"} */}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* ✅ UPDATED EDIT BUTTON */}
                                            {/* <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 flex items-center gap-1"
                                                onClick={onUpdateClick}
                                            >
                                                <Pencil className="w-4 h-4" />
                                                Edit
                                            </Button> */}

                                            {/* <Button
                                                variant="outline"
                                                size="sm"
                                                className={
                                                    item.status === "Enabled"
                                                        ? "text-red-500 hover:text-red-700 hover:bg-red-50" : "text-green-500 hover:text-green-700 hover:bg-green-50"
                                                }
                                                onClick={() => {
                                                    setSelectedOrg(item);
                                                    setShowConfirm(true);
                                                }}
                                            >
                                                {item.status === "Enabled" ? "<Power className="w-4 h-4" />" : "<Power className="w-4 h-4" />"}
                                            </Button> */}

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={
                                                    item.status === "Enabled"
                                                        ? "text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        : "text-green-500 hover:text-green-700 hover:bg-green-50"
                                                }
                                                onClick={() => {
                                                    setSelectedOrg(item);
                                                    setShowConfirm(true);
                                                }}
                                            >
                                                <Power className="w-4 h-4" />
                                            </Button>

                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                                    No data found..
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t">
                        <p className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </p>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                <ChevronLeft className="mr-2" />
                            </Button>

                            {getSlidingPages().map((page) => (
                                <Button
                                    key={page}
                                    size="sm"
                                    variant={currentPage === page ? "default" : "outline"}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                <ChevronLeft className="rotate-180 mr-2" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <span>Go to page:</span>
                            <Input
                                type="number"
                                min={1}
                                max={totalPages}
                                value={pageInput}
                                className="w-20 h-8"
                                onChange={(e) => setPageInput(e.target.value)}
                                onBlur={() => handlePageChange(Number(pageInput))}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handlePageChange(Number(pageInput));
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {selectedOrg?.status === "Enabled"
                                ? "Disable Organization?"
                                : "Enable Organization?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to{" "}
                            <b>{selectedOrg?.status === "Enabled" ? "disable" : "enable"}</b>{" "}
                            <b>{selectedOrg?.orgName}</b>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={toggleStatus}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
