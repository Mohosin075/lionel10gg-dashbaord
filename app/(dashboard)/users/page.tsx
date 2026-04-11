"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MoreVertical } from "lucide-react"
import { usersTableData } from "@/lib/dummy-data"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function UsersPage() {
  const [search, setSearch] = useState("")

  const filteredUsers = usersTableData.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  const stats = [
    { title: "Total Users", value: "5", titleColor: "text-slate-500", valueColor: "text-slate-900" },
    { title: "Active Users", value: "3", titleColor: "text-slate-500", valueColor: "text-emerald-500" },
    { title: "Restricted Users", value: "1", titleColor: "text-slate-500", valueColor: "text-amber-500" },
    { title: "Banned Users", value: "1", titleColor: "text-slate-500", valueColor: "text-red-500" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
        <p className="text-sm text-slate-500">View and manage user registration details</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className={`text-sm font-medium ${stat.titleColor} mb-2`}>{stat.title}</div>
              <div className={`text-3xl font-light ${stat.valueColor}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-5 px-6 border-b border-slate-100">
          <CardTitle className="text-base font-semibold">All Users</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8 bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:bg-white h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Bookmarks</TableHead>
                <TableHead>Highlights</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.registrationDate}</TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>{user.bookmarks}</TableCell>
                  <TableCell>{user.highlights}</TableCell>
                  <TableCell>
                    <Badge variant={user.status as any} className="capitalize">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
